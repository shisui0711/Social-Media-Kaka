import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useApiClient } from "@/app/hooks/useApiClient";
import { useSignalR } from "@/providers/SignalRProvider";
import { useAuthorization } from "@/providers/AuthorizationProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useFollowerInfo from "@/app/hooks/useFollowerInfo";
import { useToast } from "@/components/ui/use-toast";
import FollowButton from "@/components/FollowButton";

// Mock các hook và hàm
jest.mock("@/app/hooks/useApiClient");
jest.mock("@/app/hooks/useFollowerInfo");
jest.mock("@/components/ui/use-toast");
jest.mock("@/providers/SignalRProvider");
jest.mock("@/providers/AuthorizationProvider");

const queryClient = new QueryClient();

const mockedApiClient = useApiClient as jest.Mock;
const mockedUseFollowerInfo = useFollowerInfo as jest.Mock;
const mockedUseToast = useToast as jest.Mock;
const mockedUseSignalR = useSignalR as jest.Mock;
const mockedUseAuthorization = useAuthorization as jest.Mock;

describe("FollowButton Component", () => {
  beforeEach(() => {
    // Reset mock cho mỗi test
    mockedApiClient.mockReturnValue({
      followUser: jest.fn(),
      unFollowUser: jest.fn(),
    });
    mockedUseFollowerInfo.mockReturnValue({
      data: {
        isFollowedByUser: false,
        followers: 10,
      },
    });
    mockedUseToast.mockReturnValue({
      toast: jest.fn(),
    });
    mockedUseSignalR.mockReturnValue({
      sendNotification: jest.fn(),
    });
    mockedUseAuthorization.mockReturnValue({
      user: { displayName: "John Doe" },
    });
  });

  const setup = (userId: string, initialState: any) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <FollowButton userId={userId} initialState={initialState} />
      </QueryClientProvider>
    );
  };

  test("renders button with correct initial label", () => {
    setup("user-123", { isFollowedByUser: false });

    expect(screen.getByText("Theo dõi")).toBeInTheDocument();
  });

  test("calls follow API when button is clicked", async () => {
    const followUserMock = jest.fn();
    const unFollowUserMock = jest.fn();

    mockedApiClient.mockReturnValue({
      followUser: followUserMock,
      unFollowUser: unFollowUserMock,
    });

    setup("user-123", { isFollowedByUser: false });

    const button = screen.getByText("Theo dõi");
    fireEvent.click(button);

    await waitFor(() => {
      expect(followUserMock).toHaveBeenCalledTimes(1);
    });
  });

  test("updates button label after following", async () => {
    mockedUseFollowerInfo.mockReturnValueOnce({
      data: { isFollowedByUser: false, followers: 10 },
    });

    setup("user-123", { isFollowedByUser: false });

    const button = screen.getByText("Theo dõi");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Đã theo dõi")).toBeInTheDocument();
    });
  });

  test("shows notification after following", async () => {
    const sendNotificationMock = jest.fn();
    mockedUseSignalR.mockReturnValueOnce({
      sendNotification: sendNotificationMock,
    });

    setup("user-123", { isFollowedByUser: false });

    const button = screen.getByText("Theo dõi");
    fireEvent.click(button);

    await waitFor(() => {
      expect(sendNotificationMock).toHaveBeenCalledWith(
        "user-123",
        "John Doe đã theo dõi bạn"
      );
    });
  });

  test("displays error message when API request fails", async () => {
    const toastMock = jest.fn();
    mockedUseToast.mockReturnValue({
      toast: toastMock,
    });

    mockedApiClient.mockReturnValueOnce({
      followUser: jest.fn().mockRejectedValue(new Error("429")),
      unFollowUser: jest.fn().mockRejectedValue(new Error("429")),
    });

    setup("user-123", { isFollowedByUser: false });

    const button = screen.getByText("Theo dõi");
    fireEvent.click(button);

    await waitFor(() => {
      expect(toastMock).toHaveBeenCalledWith({
        title: "Thao tác quá nhanh. Hãy chậm lại.",
        variant: "destructive",
      });
    });
  });
});
