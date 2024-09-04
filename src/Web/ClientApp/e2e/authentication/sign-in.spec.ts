import { test, expect } from "@playwright/test";
import { server } from "e2e/server";

test.describe("Sign In Tests", () => {
  test.beforeAll(() => server.listen())
  test.afterEach(() => server.resetHandlers());
  test.afterAll(() => server.close());

  test("Should login success if account is exist and password is correct", async ({
    page,
  }) => {
    await page.goto("/sign-in");
    await expect(page).toHaveTitle("Đăng nhập | Kaka");
    const usernameInput = await page.getByPlaceholder(
      "Nhập tên đăng nhập hoặc email"
    );
    const passwordInput = await page.getByPlaceholder("Nhập mật khẩu");
    const signInButton = await page.getByRole("button", { name: "Đăng nhập" });

    await usernameInput.fill("admin");
    await passwordInput.fill("123456");
    await signInButton.click();

    await expect(page).toHaveURL("http://localhost:3000");
  });
});
