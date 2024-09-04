import React, { useState } from 'react'
import { MyUserDto } from "@/app/web-api-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, TriangleAlert } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { DatePicker } from '@/components/ui/DatePicker';
import { useToast } from '@/components/ui/use-toast';
import { ChangeBirthDay } from './actions';

interface Props {
  user: MyUserDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditBirthDayDialog = ({ user, open, onOpenChange }: Props) => {
  const [date, setDate] = useState<Date | undefined>(user.birthDay ? new Date(user.birthDay) : new Date());
  const { toast } = useToast();
  const {
    isPending,
    mutate
  } = useMutation({
    mutationFn: ChangeBirthDay,
    onSuccess(success){
      if (success) {
        toast({
          title: "Cập nhật ngày sinh thành công",
        });
      } else {
        toast({
          title: "Cập nhật ngày sinh thất bại",
          description: "Mỗi lần cập nhật cách nhau 30 ngày",
          variant: "destructive",
        });
      }
    },
    onError(error){
      toast({
        title: "Có lỗi xảy ra vui lòng thử lại sau.",
        variant: "destructive"
      });
    }
  })

  const handleSubmit = () => {
    if(!date){
      toast({
        title:"Vui lòng chọn ngày sinh",
        variant: "destructive"
      });
      return;
    }
    mutate(date)
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger>
        <Button className="flex items-center gap-2">
          <Pencil size={15} />
          <p className="hidden md:block">Thay đổi</p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-primary">
            Thay đổi ngày sinh
          </DialogTitle>
          <Separator />
          <DialogDescription className='text-center space-y-3'>
            <DatePicker date={date} setDate={setDate}/>
            <div className='flex items-center gap-2 text-red-500'>
              <TriangleAlert  />
              <p className='text-xs md:text-sm'>Lưu ý: Thông tin này chỉ có thể thay đổi trong thời gian nhất định.</p>
            </div>
            <Button type="button" className="w-full" onClick={handleSubmit}>
                  Lưu thay đổi
                  <Loader
                    className={cn(
                      "animate-spin ml-2 hidden",
                      isPending && "inline-block"
                    )}
                  />
            </Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default EditBirthDayDialog