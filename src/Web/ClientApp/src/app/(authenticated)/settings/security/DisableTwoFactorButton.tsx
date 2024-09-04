import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import React from "react";

const DisableTwoFactorButton = () => {
  return (
    <Button className="flex items-center justify-between gap-2 w-full">
      <p>Tắt xác thực 2 yếu tố</p>
      <ChevronRight size={15} />
    </Button>
  );
};

export default DisableTwoFactorButton;
