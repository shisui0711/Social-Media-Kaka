import { z } from "zod";

export const signUpSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "Họ không được để trống")
    .regex(
      /^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ\s]*$/,
      "Họ không hợp lệ"
    ),
  lastName: z
    .string()
    .trim()
    .min(1, "Tên không được để trống")
    .regex(
      /^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ\s]*$/,
      "Tên không hợp lệ"
    ),
  email: z
    .string()
    .trim()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
  username: z
    .string()
    .trim()
    .min(1, "Tên đăng nhập không được để trống")
    .regex(/^[A-z0-9-]{1,30}$/, "Tên đăng nhập không hợp lệ"),
  password: z.string().trim().min(8, "Mật khẩu phải có ít nhất 8 ký tự")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,"Mật khẩu phải gồm ký tự in hoa, in thường, số và ký tự đặc biệt"),
  repassword: z.string().trim().min(1, "Mật khẩu không được để trống"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  username: z.string().trim().min(1, "Tên đăng nhập không được để trống"),
  password: z.string().trim().min(1, "Mật khẩu không được để trống"),
});

export type SignInValues = z.infer<typeof signInSchema>;

export const forgottenSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
});

export type ForgottenValues = z.infer<typeof forgottenSchema>;

export const recoveryPasswordSchema = z.object({
  password: z.string().trim().min(8, "Mật khẩu phải có ít nhất 8 ký tự")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,"Mật khẩu phải gồm ký tự in hoa, in thường, số và ký tự đặc biệt"),
  repassword: z.string().trim().min(1, "Mật khẩu không được để trống"),
})

export type RecoveryPasswordValues = z.infer<typeof recoveryPasswordSchema>

export const changeEmailSchema = z.object({
  email: z
  .string()
  .trim()
  .min(1, "Email không được để trống")
  .email("Email không hợp lệ"),
  password: z.string().trim().min(1, "Mật khẩu không được để trống")
});

export type ChangeEmailValues = z.infer<typeof changeEmailSchema>

export const changePhoneNumberSchema = z.object({
  phoneNumber: z.string().trim().min(1, "Số điện thoại không được để trống")
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Số điện thoại không hợp lệ"),
    password: z.string().trim().min(1, "Mật khẩu không được để trống")
});

export type ChangePhoneNumberValues = z.infer<typeof changePhoneNumberSchema>

export const changePasswordSchema = z.object({
  oldPassword: z.string().trim().min(1, "Mật khẩu không được để trống"),
  newPassword: z.string().trim().min(8, "Mật khẩu phải có ít nhất 8 ký tự")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,"Mật khẩu phải gồm ký tự in hoa, in thường, số và ký tự đặc biệt"),
  repassword: z.string().trim().min(1, "Mật khẩu không được để trống"),
});

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>

export const createPostSchema = z.object({
  content: z.string().trim().min(1, "Nội dung không được để trống"),
  medias: z
    .array(z.object({ mediaUrl: z.string(), type: z.string() }))
    .max(5, "Bạn chỉ được chọn tối đa 5 ảnh/video"),
});

export type CreatePostValues = z.infer<typeof createPostSchema>;

export const updateUserProfileSchema = z.object({
  userName: z.string().trim().min(1, "Tên đăng nhập không được để trống"),
  firstName: z.string().trim().min(1, "Nội dung không được để trống"),
  lastName: z.string().trim().min(1, "Nội dung không được để trống"),
  bio: z.string().trim().max(1000, "Tối đa 1000 ký tự"),
});

export const updateUserInformationSchema = z.object({
  firstName: z.string().trim().min(1, "Nội dung không được để trống"),
  lastName: z.string().trim().min(1, "Nội dung không được để trống"),
  bio: z.string().trim().max(1000, "Tối đa 1000 ký tự"),
  username: z.string().trim().min(1, "Tên đăng nhập không được để trống"),
  email: z
    .string()
    .trim()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
  phone: z
    .string()
    .trim()
    .regex(/^0[1-9]{1}[0-9]{8}$/, "Số điện thoại không hợp lệ")
    .optional(),
});

export type UpdateUserInformationValues = z.infer<
  typeof updateUserInformationSchema
>;

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;

export const createCommentSchema = z.object({
  content: z.string().trim().min(1, "Nội dung không được để trống"),
});

export const createMessageSchema = z.object({
  message: z.string().trim().min(1, "Nội dung không được để trống"),
});
