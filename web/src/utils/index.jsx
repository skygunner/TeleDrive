export const humanReadableSize = (size, si = false, dp = 1) => {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(size) < thresh) {
    return size + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    size /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(size) * r) / r >= thresh &&
    u < units.length - 1
  );

  return size.toFixed(dp) + " " + units[u];
};

export const humanReadableDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const fileExtension = (fileName) => {
  const split = fileName.split(".");
  if (split.length > 1) {
    return split.pop();
  }

  return "";
};
