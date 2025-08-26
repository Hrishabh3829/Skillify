import Stripe from "stripe";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/purchaseCourse.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found!" });

    //create a new course purchase record
    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
    });
    //create stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.courseTitle,
              images: [course.courseThumbnail],
            },
            unit_amount: course.coursePrice * 100, //amount in paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/course-progress/${courseId}`,
      cancel_url: `http://localhost:5173/course-detail/${courseId}`,
      metadata: {
        courseId: courseId,
        userId: userId,
      },
      shipping_address_collection: {
        allowed_countries: ["IN"], //optionally restrict allowed countries
      },
    });
    if (!session.url) {
      return res.status(400).json({
        success: false,
        message: "Error while creating session",
      });
    }
    //save the purchase record
    newPurchase.paymentId = session.id;
    await newPurchase.save();

    return res.status(200).json({
      success: true,
      url: session.url, //return stripe checkout
    });
  } catch (error) {
    console.log("StripeError: ", error);
  }
};

export const stripeWebhook = async (req, res) => {
  let event;
  try {
    const payloadString = JSON.stringify(req.body, null, 2);
    const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret,
    });
    event = stripe.webhooks.constructEvent(payloadString, header, secret);
  } catch (error) {
    console.log("stripeWebhook Error:", error.message);
    return res.status(400).send(`Webhok error:${error.message}`);
  }
  //Handle the checkout session completed event
  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object;

      const purchase = await CoursePurchase.findOne({
        paymentId: session.id,
      }).populate({ path: "courseId" });
      if (!purchase) {
        return res.status(404).json({
          message: "Purchase not found",
        });
      }
      if (session.amount_total) {
        purchase.amount = session.amount_total / 100;
      }
      purchase.status = "completed";
      //make all lectures free visible by setting 'ispreview free' to true
      if (purchase.courseId && purchase.courseId.lectures.length > 0) {
        await Lecture.updateMany(
          {
            _id: { $in: purchase.courseId.lectures },
          },
          {
            $set: { isPreviewFree: true },
          }
        );
      }
      await purchase.save();

      //update users enrolled courses
      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId._id } },
        { new: true }
      );
      //update course to add user id to enrolled students
      await Course.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: purchase.userId } }, //add userID to enrolled students
        { new: true }
      );
    } catch (error) {
      console.error("Error handling events: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  res.status(200).send();
};
