<script>
  import { Gallery } from "flowbite-svelte";
  const images = [
    {
      alt: "erbology",
      src: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image.jpg",
    },
    {
      alt: "shoes",
      src: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg",
    },
    {
      alt: "small bag",
      src: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg",
    },
    {
      alt: "plants",
      src: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg",
    },
    {
      alt: "watch",
      src: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg",
    },
    {
      alt: "shoe",
      src: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg",
    },
    {
      alt: "cream",
      src: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-6.jpg",
    },
    {
      alt: "small bag",
      src: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-7.jpg",
    },
    {
      alt: "lamp",
      src: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-8.jpg",
    },
    {
      alt: "toiletbag",
      src: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-9.jpg",
    },
    {
      alt: "playstation",
      src: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-10.jpg",
    },
    {
      alt: "bag",
      src: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-11.jpg",
    },
  ];

  import { Alert } from "flowbite-svelte";
</script>

<div class="p-8">
  <Alert>
    <span class="font-medium">Info alert!</span>
    Change a few things up and try submitting again.
  </Alert>
</div>

<Gallery items={images} class="grid gap-4 grid-cols-2 md:grid-cols-3" />
