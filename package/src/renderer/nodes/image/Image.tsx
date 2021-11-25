import { NodeType } from "../../Host";
import type { SkNode } from "../../Host";
import type { IImage } from "../../../skia";
import { useImage, Skia } from "../../../skia";
import { exhaustiveCheck } from "../../exhaustiveCheck";

// https://api.flutter.dev/flutter/painting/BoxFit-class.html
export type BoxFit =
  | "cover"
  | "contain"
  | "fill"
  | "fitHeight"
  | "fitWidth"
  | "none"
  | "scaleDown";

export interface UnresolvedImageProps {
  source: number | IImage;
  x: number;
  y: number;
  width: number;
  height: number;
  fit: BoxFit;
}

export interface ImageProps extends Omit<UnresolvedImageProps, "source"> {
  source: IImage;
}

export const Image = ({
  source,
  x,
  y,
  width,
  height,
  fit: resizeMode,
}: UnresolvedImageProps) => {
  const image = useImage(source);
  if (image === null) {
    return null;
  }
  return (
    <>
      <skImage
        source={image}
        x={x}
        y={y}
        width={width}
        height={height}
        fit={resizeMode}
      />
    </>
  );
};

Image.defaultProps = {
  x: 0,
  y: 0,
  resizeMode: "contain",
};

interface Size {
  width: number;
  height: number;
}

const size = (width = 0, height = 0) => ({ width, height });

export const ImageNode = (props: ImageProps): SkNode<NodeType.Image> => ({
  type: NodeType.Image,
  props,
  draw: (
    { canvas, paint },
    { source, x, y, width, height, fit: resizeMode }
  ) => {
    const sizes = applyBoxFit(
      resizeMode,
      { width: source.width(), height: source.height() },
      { width, height }
    );
    const inputSubrect = inscribe(sizes.source, {
      x: 0,
      y: 0,
      width: source.width(),
      height: source.height(),
    });
    const outputSubrect = inscribe(sizes.destination, { x, y, width, height });
    canvas.drawImageRect(source, inputSubrect, outputSubrect, paint);
  },
  children: [],
});

const inscribe = (
  { width, height }: Size,
  rect: { x: number; y: number; width: number; height: number }
) => {
  const halfWidthDelta = (rect.width - width) / 2.0;
  const halfHeightDelta = (rect.height - height) / 2.0;
  return Skia.XYWHRect(
    rect.x + halfWidthDelta,
    rect.y + halfHeightDelta,
    width,
    height
  );
};

const applyBoxFit = (fit: BoxFit, inputSize: Size, outputSize: Size) => {
  let source = size(),
    destination = size();
  if (
    inputSize.height <= 0.0 ||
    inputSize.width <= 0.0 ||
    outputSize.height <= 0.0 ||
    outputSize.width <= 0.0
  ) {
    return { source, destination };
  }
  switch (fit) {
    case "fill":
      source = inputSize;
      destination = outputSize;
      break;
    case "contain":
      source = inputSize;
      if (outputSize.width / outputSize.height > source.width / source.height) {
        destination = size(
          (source.width * outputSize.height) / source.height,
          outputSize.height
        );
      } else {
        destination = size(
          outputSize.width,
          (source.height * outputSize.width) / source.width
        );
      }
      break;
    case "cover":
      if (
        outputSize.width / outputSize.height >
        inputSize.width / inputSize.height
      ) {
        source = size(
          inputSize.width,
          (inputSize.width * outputSize.height) / outputSize.width
        );
      } else {
        source = size(
          (inputSize.height * outputSize.width) / outputSize.height,
          inputSize.height
        );
      }
      destination = outputSize;
      break;
    case "fitWidth":
      source = size(
        inputSize.width,
        (inputSize.width * outputSize.height) / outputSize.width
      );
      destination = size(
        outputSize.width,
        (source.height * outputSize.width) / source.width
      );
      break;
    case "fitHeight":
      source = size(
        (inputSize.height * outputSize.width) / outputSize.height,
        inputSize.height
      );
      destination = size(
        (source.width * outputSize.height) / source.height,
        outputSize.height
      );
      break;
    case "none":
      source = size(
        Math.min(inputSize.width, outputSize.width),
        Math.min(inputSize.height, outputSize.height)
      );
      destination = source;
      break;
    case "scaleDown":
      source = inputSize;
      destination = inputSize;
      const aspectRatio = inputSize.width / inputSize.height;
      if (destination.height > outputSize.height) {
        destination = size(outputSize.height * aspectRatio, outputSize.height);
      }
      if (destination.width > outputSize.width) {
        destination = size(outputSize.width, outputSize.width / aspectRatio);
      }
      break;
    default:
      exhaustiveCheck(fit);
  }
  return { source, destination };
};
