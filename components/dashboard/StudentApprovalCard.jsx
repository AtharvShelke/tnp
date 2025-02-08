'use client';

import { useState } from "react";
import Modal from "./EditStudentModal";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const StudentApprovalCard = ({ id, prn, name, pfp, existingValues, changes }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAccept = () => {
    closeModal();
    toast.success("Accepted");
  };

  const handleReject = () => {
    closeModal();
    toast.error("Rejected");
  };

  return (
    <Card className="w-full max-w-sm mx-auto bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6 flex flex-col items-center space-y-4">
        <img
          className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          src={pfp || "/logo.jpg"}
          alt="avatar"
        />
        <h5 className="text-xl font-semibold text-gray-900">{name}</h5>
        <p className="text-sm text-gray-500">{prn}</p>
        <Button onClick={openModal} className="w-full bg-blue-600 hover:bg-blue-700">
          View Details
        </Button>
      </CardContent>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        name={name}
        prn={prn}
        existingValues={existingValues}
        changes={changes}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </Card>
  );
};

export default StudentApprovalCard;