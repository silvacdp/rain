<script lang="ts">
  // Define the shape of your image attachments.
  // Extend this if you need additional properties (e.g., filename, thumbnails).
  export interface ImageAttachment {
    id: string;
    url: string;
    filename?: string;
    type?: string;
    size?: number;
    // Add more fields if needed, e.g. thumbnails, etc.
  }

  // The component receives an array of images as a prop.
  export let images: ImageAttachment[] = [];

  // We track the current slide index for the slider.
  let currentIndex = 0;

  // We'll store the slider (scrollable container) reference for controlling scroll position.
  let slider: HTMLDivElement | null = null;

  // Scroll to the index we want (like 'goTo' in your Vue code).
  function goTo(index: number) {
    if (!slider) return;
    // Slide width is the container width
    const slideWidth = slider.offsetWidth;
    currentIndex = index;

    // Smoothly scroll to the exact position needed for that slide
    slider.scrollTo({
      left: index * slideWidth,
      behavior: 'smooth'
    });
  }

  // Go to the next slide if not at the end
  function next() {
    if (currentIndex < images.length - 1) {
      goTo(currentIndex + 1);
    }
  }

  // Go to the previous slide if not at the beginning
  function previous() {
    if (currentIndex > 0) {
      goTo(currentIndex - 1);
    }
  }

  // As the user scrolls, update the currentIndex
  function handleScroll() {
    if (!slider) return;
    const scrollLeft = slider.scrollLeft;
    const slideWidth = slider.offsetWidth;
    // Round to the nearest integer so we know which slide we’re on
    currentIndex = Math.round(scrollLeft / slideWidth);
  }

  // Utility: If there's exactly one image, we can show it full-size.
  const hasSingleImage = images.length === 1;
</script>

{#if hasSingleImage}
  <!-- If there's only one image, show a simple, full-size image. -->
  <div class="single-image-container">
    <img src={images[0].url} alt={images[0].filename} />
  </div>
{:else if images.length > 1}
  <!-- Otherwise, display a scrollable slider with navigation arrows. -->
  <div class="slider-container">
    <div class="slider" bind:this={slider} on:scroll={handleScroll}>
      {#each images as image, i}
        <div class="slide">
          <!-- 
            You could display additional info here 
            (e.g. image.filename or thumbnails) 
          -->
          <img src={image.url} alt={image.filename} />
        </div>
      {/each}
    </div>
    
    <!-- Navigation (Arrows + dots) -->
    <div class="navigation">
      <!-- Previous Button -->
      <button
        class="arrow-button"
        on:click={previous}
        disabled={currentIndex === 0}>
        ‹
      </button>

      <!-- Dots or mini-buttons to jump to each slide -->
      <div class="dots">
        {#each images as _, i}
          <button
            class:selected={currentIndex === i}
            on:click={() => goTo(i)}>
            •
          </button>
        {/each}
      </div>

      <!-- Next Button -->
      <button
        class="arrow-button"
        on:click={next}
        disabled={currentIndex === images.length - 1}>
        ›
      </button>
    </div>
  </div>
{:else}
  <!-- Edge case: No images -->
  <p>No images to display.</p>
{/if}

<style>
  :global(*) {
    box-sizing: border-box;
  }

  /* If there's only one image, just center it nicely */
  .single-image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1rem auto;
    max-width: 100%;
  }

  .single-image-container img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
  }

  /* Slider container if multiple images */
  .slider-container {
    position: relative;
    width: 100%;
    margin: 1rem 0;
  }

  /* The scrollable slider itself */
  .slider {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; /* Hide scrollbar in Firefox */
    width: 100%;
    border-radius: 6px;
  }

  /* Hide scrollbar in WebKit browsers */
  .slider::-webkit-scrollbar {
    display: none;
  }

  /* Each slide is 100% of the container width */
  .slide {
    scroll-snap-align: start;
    flex: 0 0 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
  }

  .slide img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    /* Optionally add a box-shadow or border for a nice look */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  /* Navigation container (arrows + dots) */
  .navigation {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1rem;
    gap: 1rem;
  }

  .arrow-button {
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    opacity: 0.7;
  }

  .arrow-button[disabled] {
    opacity: 0.3;
    cursor: not-allowed;
  }

  /* Dots (simple approach; each one is a button) */
  .dots {
    display: flex;
    gap: 0.4rem;
  }

  .dots button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    line-height: 1;
    opacity: 0.6;
  }

  .dots button.selected {
    opacity: 1;
    color: #333;
  }
</style>
