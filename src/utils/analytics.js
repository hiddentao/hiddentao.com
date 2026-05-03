export const track = (event, data) => {
  if (typeof window === "undefined") return
  if (!window.umami || typeof window.umami.track !== "function") return
  if (data) {
    window.umami.track(event, data)
  } else {
    window.umami.track(event)
  }
}
