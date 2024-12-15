"use client";

import { useEffect, useState } from "react";
import { Maximize, Minimize } from "lucide-react";
import { Button } from "../ui/button";

export default function FullScreenButton() {
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            const fullscreenElement = document.fullscreenElement;
            setIsFullscreen(!!fullscreenElement);

            // Ensure scrolling is enabled during fullscreen
            if (fullscreenElement) {
                document.body.style.overflow = "auto"; // Allow scrolling
            } else {
                document.body.style.overflow = ""; // Reset to default
            }
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    const enterFullScreen = () => {
        const body = document.body;

        if (body.requestFullscreen) {
            body.requestFullscreen();
        } else if ((body as any).mozRequestFullScreen) {
            (body as any).mozRequestFullScreen(); // Firefox
        } else if ((body as any).webkitRequestFullscreen) {
            (body as any).webkitRequestFullscreen(); // Chrome, Safari, Opera
        } else if ((body as any).msRequestFullscreen) {
            (body as any).msRequestFullscreen(); // IE/Edge
        }
    };

    const exitFullScreen = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
            (document as any).mozCancelFullScreen(); // Firefox
        } else if ((document as any).webkitExitFullscreen) {
            (document as any).webkitExitFullscreen(); // Chrome, Safari, Opera
        } else if ((document as any).msExitFullscreen) {
            (document as any).msExitFullscreen(); // IE/Edge
        }
    };

    return (
        <div>
            {isFullscreen ? (
                <Button onClick={exitFullScreen} size="icon" variant="outline">
                    <Minimize className="h-4 w-4" />
                </Button>
            ) : (
                <Button onClick={enterFullScreen} size="icon" variant="outline">
                    <Maximize className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
