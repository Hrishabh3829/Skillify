import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import { useNavigate } from "react-router-dom";

const Coursetable = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Button onClick={() => navigate(`create`)}>Create a new course</Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Docker hero to zero</TableCell>
            <TableCell>$49</TableCell>
            <TableCell>published</TableCell>
            <TableCell>revoke</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Python Essentials</TableCell>
            <TableCell>$59</TableCell>
            <TableCell>published</TableCell>
            <TableCell>pending</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default Coursetable;
