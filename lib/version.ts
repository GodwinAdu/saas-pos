import { version as generateVersion } from "@/package.json";

export default function getAppVersion() {
    return generateVersion;
}