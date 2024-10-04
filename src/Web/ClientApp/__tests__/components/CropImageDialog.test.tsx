import React from "react"; // Make sure React is imported first
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CropImageDialog from "@/components/CropImageDialog";

// Mock the Cropper component from react-cropper
jest.mock("react-cropper", () => ({
  __esModule: true,
  // eslint-disable-next-line react/display-name
  Cropper: React.forwardRef((props, ref) => {
    // Mock implementation of the ref behavior for Cropper
    if (ref && typeof ref === "object" && ref !== null) {
      ref.current = {
        cropper: {
          getCroppedCanvas: jest.fn().mockReturnValue({
            toBlob: (cb: (blob: Blob) => void) => {
              const blob = new Blob(["image"], { type: "image/webp" });
              cb(blob);
            },
          }),
        },
      };
    }
    return <div data-testid="cropper" />;
  }),
}));

describe("CropImageDialog", () => {
  const src = "image-src";
  const cropAspectRatio = 1;
  const onCropped = jest.fn();
  const onClose = jest.fn();

  beforeEach(() => {
    onCropped.mockClear();
    onClose.mockClear();
  });

  it("should render dialog with the Cropper and buttons", () => {
    render(
      <CropImageDialog
        src={src}
        cropAspectRatio={cropAspectRatio}
        onCropped={onCropped}
        onClose={onClose}
      />
    );

    // Check if the cropper component is rendered
    expect(screen.getByTestId("cropper")).toBeInTheDocument();

    // Check if buttons are rendered
    expect(screen.getByText("Hủy")).toBeInTheDocument();
    expect(screen.getByText("Cắt")).toBeInTheDocument();
  });

  it("should call onClose when cancel button is clicked", () => {
    render(
      <CropImageDialog
        src={src}
        cropAspectRatio={cropAspectRatio}
        onCropped={onCropped}
        onClose={onClose}
      />
    );

    // Click the cancel button
    fireEvent.click(screen.getByText("Hủy"));

    // Check if onClose is called
    expect(onClose).toHaveBeenCalled();
  });

  it("should crop image and call onCropped when crop button is clicked", async () => {
    render(
      <CropImageDialog
        src={src}
        cropAspectRatio={cropAspectRatio}
        onCropped={onCropped}
        onClose={onClose}
      />
    );

    // Click the crop button
    fireEvent.click(screen.getByText("Cắt"));

    await waitFor(() => {
      // Check if onCropped is called with the cropped blob
      expect(onCropped).toHaveBeenCalledWith(expect.any(Blob));

      // Check if onClose is called after cropping
      expect(onClose).toHaveBeenCalled();
    });
  });

  // it("should not crop if cropper is not available", () => {
  //   // Mock useRef to simulate no cropper available
  //   const useRefSpy = jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: null });

  //   render(
  //     <CropImageDialog
  //       src={src}
  //       cropAspectRatio={cropAspectRatio}
  //       onCropped={onCropped}
  //       onClose={onClose}
  //     />
  //   );

  //   // Click the crop button
  //   fireEvent.click(screen.getByText("Cắt"));

  //   // Ensure onCropped is NOT called when cropper is unavailable
  //   expect(onCropped).not.toHaveBeenCalled();

  //   // onClose should still be called
  //   expect(onClose).toHaveBeenCalled();

  //   // Clean up mock
  //   useRefSpy.mockRestore();
  // });
});
