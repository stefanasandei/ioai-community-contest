import { cn } from "@/lib/utils";

const MDXImage = ({ className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img className={cn("mx-auto block", className)} {...props} />
);
MDXImage.displayName = "MDXImage";

export default MDXImage;
