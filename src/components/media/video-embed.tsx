
export default function VideoEmbed({embedUrl}: {embedUrl: string}) {
  return (
    <iframe
    src={embedUrl}
    style={{
      width: "960px",
      height: "540px",
    }}
    frameBorder="0"
    allow="autoplay; fullscreen"
    allowFullScreen
  ></iframe>
  )
}