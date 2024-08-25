import UserAvatar from "@/components/UserAvatar";
import { render, screen } from "@testing-library/react";

describe("UserAvatar", () => {
  it("renders the user avatar image when avatarUrl is provided", async () => {
    //Arrange
    const avatarUrl = "https://example.com/avatar.png";
    render(<UserAvatar avatarUrl={avatarUrl} size={100} />);
    //Act
    const image = screen.getByAltText("User avatar");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', expect.stringContaining(encodeURIComponent(avatarUrl)));
    expect(image).toHaveAttribute("width", "100");
    expect(image).toHaveAttribute("height", "100");
  });

  it("renders the default user avatar image when avatarUrl is not provided ", () => {
    render(<UserAvatar size={100} />);
    const image = screen.getByAltText("User avatar");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", expect.stringContaining(encodeURIComponent("/images/user-placeholder.png")))
    expect(image).toHaveAttribute("width", "100");
    expect(image).toHaveAttribute("height", "100");
  });

  it("renders the avatar with default size when size is not provided", () => {
    render(<UserAvatar avatarUrl="https://example.com/avatar.png" />);
    const image = screen.getByAltText("User avatar");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("width", "48");
    expect(image).toHaveAttribute("height", "48");
  });

  it("applies additional className correctly", () => {
    const customClass = "custom-class";
    render(
      <UserAvatar
        avatarUrl="https://example.com/avatar.png"
        className={customClass}
      />
    );

    const image = screen.getByAltText("User avatar");
    expect(image).toBeInTheDocument();
    expect(image).toHaveClass("custom-class");
  });

  it("renders with default classes for rounded and aspect ratio", () => {
    render(<UserAvatar avatarUrl="https://example.com/avatar.png" />);
    const image = screen.getByAltText("User avatar");
    expect(image).toBeInTheDocument();
    expect(image).toHaveClass("aspect-square", "rounded-full", "object-cover");
  });
});
