
// import { google } from "@/auth";
// import { convertToUsername } from "@/lib/utils";
// import { OAuth2RequestError } from "arctic";
// import { cookies } from "next/headers";
// import { NextRequest } from "next/server";
// import { nanoid } from 'nanoid'
// import { BASE_API_URL } from "../../../../app.config";

// export async function GET(req: NextRequest){
//   const code = req.nextUrl.searchParams.get('code')
//   const state = req.nextUrl.searchParams.get('state')

//   const storedState = cookies().get('state')?.value
//   const storedCodeVerifier = cookies().get('code_verifier')?.value

//   if(
//     !code || !state || !storedState || !storedCodeVerifier || state !== storedState
//   ){
//     return new Response(null,{status:400})
//   }

//   try {
//     const tokens = await google.validateAuthorizationCode(code,storedCodeVerifier)

//     const googleUser = await kyInstance.get("https://www.googleapis.com/oauth2/v1/userinfo",{
//       headers:{
//         Authorization:`Bearer ${tokens.accessToken}`
//       }
//     }).json<{id:string;name:string,email:string}>()

//     const existingUser = await fetch(`${BASE_API_URL}/auth/google/${googleUser.id}`)
//     .then(res => res.json() as Promise<ApiResponse<AuthResponse>>).then(res=>res.data)

//     if(existingUser){
//       const data = await fetch(`${BASE_API_URL}/auth/google/sign-in`,{
//         method: "POST",
//         headers:{
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           googleId: googleUser.id
//         })
//       }).then(res=>res.json() as Promise<ApiResponse<AuthResponse>>).then(res=>res.data)
//       cookies().set("token", data?.token!, {
//         httpOnly: true,
//         secure: true,
//         sameSite: "strict",
//         path: "/",
//       })
//       cookies().set("_kaka_refreshToken", data?.refreshToken!, {
//         httpOnly: true,
//         secure: true,
//         sameSite: "strict",
//         maxAge: 60 * 60 * 24 * 30, // 30 days
//       })
//       return new Response(null,{
//         status: 302,
//         headers: {
//           Location: '/'
//         }
//       })
//     }else{
//       const username = convertToUsername(googleUser.name) + '-' + nanoid(6)
//       const data = await fetch(`${BASE_API_URL}/auth/google/sign-up`,{
//         method: 'POST',
//         headers:{
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           username,
//           displayName: googleUser.name,
//           firstName: googleUser.name.split(' ')[0] ?? '',
//           lastName: googleUser.name.split(' ')[1] ?? '',
//           googleId: googleUser.id,
//           email: googleUser.email,
//         })
//       }).then(res=>res.json() as Promise<ApiResponse<AuthResponse>>).then(res=>res.data)
//       cookies().set("token", data?.token!, {
//         httpOnly: true,
//         secure: true,
//         sameSite: "strict",
//         path: "/",
//       })
//       cookies().set("_kaka_refreshToken", data?.refreshToken!, {
//         httpOnly: true,
//         secure: true,
//         sameSite: "strict",
//         maxAge: 60 * 60 * 24 * 30, // 30 days
//       })
//       return new Response(null,{
//         status: 302,
//         headers: {
//           Location: '/'
//         }
//       })
//     }
//   } catch (error) {
//     console.log(error)
//     if(error instanceof OAuth2RequestError){
//       return new Response(null,{status:400})
//     }
//     return new Response(null,{status:500})
//   }
// }