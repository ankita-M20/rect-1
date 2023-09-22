// PinchZoom class for pinch zooming
/*
class PinchZoom {
  constructor(element, canvas) {
    this.element = element;
    this.canvas = canvas;

    this.scale = 1.0;
    this.lastDistance = null;
    // Initialize zoomCenter to (0, 0)
    this.zoomCenter = { x: 0, y: 0 }; // Store the zoom center
    this.prevZoomCenter = { x: 0, y: 0 }; // Store the previous zoom center
    this.position = { x: 0, y: 0 }; // Store the updated position
    this.positionDelta = { x: 0, y: 0 }; // Store the accumulated position changes

    this.setEventListeners();
  }

  doZoom(delta, zoomCenterX, zoomCenterY) {
    const newScale = this.scale + delta;

    if (newScale > 9.0 || newScale < 0.1) {
      return;
    }

    // Calculate the position adjustment based on zoom center relative to mydiv
    const centerX = zoomCenterX - this.position.x;
    const centerY = zoomCenterY - this.position.y;

    console.log("center: ", centerX, centerY);
    const deltaX = centerX * delta - centerX;
    const deltaY = centerY * delta - centerY;
    console.log("delta: ", deltaX, deltaY);

    // Calculate the minimum and maximum positions
    const minLeft =
      this.canvas.clientWidth - this.element.clientWidth * newScale;
    const maxLeft = 0;
    const minTop =
      this.canvas.clientHeight - this.element.clientHeight * newScale;
    const maxTop = 0;

    // Update the position based on the center point

    this.prevZoomCenter.x = this.zoomCenter.x;
    this.prevZoomCenter.y = this.zoomCenter.y;
    console.log(this.prevZoomCenter, "prev center");
    this.zoomCenter.x = (this.prevZoomCenter.x + zoomCenterX) / 2;
    this.zoomCenter.y = (this.prevZoomCenter.y + zoomCenterY) / 2;
    console.log(this.zoomCenter, "zoom center");
    const newX = this.position.x - deltaX;
    const newY = this.position.y - deltaY;
    console.log("new: ", newX, newY);

    //this.position.x = (centerX + this.prevZoomCenter.x) / 2;
    // this.position.y = (centerY + this.prevZoomCenter.y) / 2;
    // Ensure the new position is within bounds
    this.position.x = Math.min(maxLeft, Math.max(minLeft, newX));
    this.position.y = Math.min(maxTop, Math.max(minTop, newY));

    console.log(this.position);
    this.scale = newScale;

    // Apply the transformations to the element
    this.element.style.transform = `scale(${this.scale}) translate(${this.position.x}px, ${this.position.y}px)`;
  }

  setEventListeners() {
    // Touch events for pinch zoom
    this.element.addEventListener("touchmove", (e) => {
      e.preventDefault();
      if (e.targetTouches.length == 2) {
        // Pinch zoom
        const p1 = e.targetTouches[0];
        const p2 = e.targetTouches[1];
        const currentDistance = Math.sqrt(
          Math.pow(p2.pageX - p1.pageX, 2) + Math.pow(p2.pageY - p1.pageY, 2)
        );

        if (this.lastDistance !== null) {
          const delta = (currentDistance - this.lastDistance) / 100; // You can adjust the sensitivity
          const zoomCenterX = (p1.pageX + p2.pageX) / 2;
          const zoomCenterY = (p1.pageY + p2.pageY) / 2;
          this.doZoom(delta, zoomCenterX, zoomCenterY);
        }

        this.lastDistance = currentDistance;
      }
    });

    this.element.addEventListener("wheel", (e) => {
      e.preventDefault();
      const delta = -e.deltaY / 100; // You can adjust the sensitivity
      const zoomCenterX = e.clientX;
      const zoomCenterY = e.clientY;
      this.doZoom(delta, zoomCenterX, zoomCenterY);
    });

    // Reset lastDistance when touch ends
    this.element.addEventListener("touchend", () => {
      this.lastDistance = null;
    });

    // Store the zoom center when dragging starts
    this.element.addEventListener("pointerdown", (e) => {
      this.zoomCenter.x = e.clientX;
      this.zoomCenter.y = e.clientY;
      //this.positionDelta = { x: 0, y: 0 };
    });
  }
}*/
class PinchZoom {
  constructor(element, canvas) {
    this.element = element;
    this.canvas = canvas;

    this.scale = 1.0;
    this.lastDistance = null;
    // Initialize zoomCenter and prevZoomCenter to (0, 0)
    this.zoomCenter = { x: 0, y: 0 }; // Store the current zoom center
    this.prevZoomCenter = { x: 0, y: 0 }; // Store the previous zoom center
    this.position = { x: 0, y: 0 }; // Store the updated position
    this.positionDelta = { x: 0, y: 0 }; // Store the accumulated position changes

    this.setEventListeners();
  }

  doZoom(delta, zoomCenterX, zoomCenterY) {
    const newScale = this.scale + delta;

    if (newScale > 9.0 || newScale < 0.1) {
      return;
    }

    // Calculate the position adjustment based on zoom center relative to mydiv
    const centerX = zoomCenterX - this.position.x;
    const centerY = zoomCenterY - this.position.y;

    const newX = (centerX - this.prevZoomCenter.x) / 2;
    const newY = (centerY - this.prevZoomCenter.y) / 2;

    // Calculate the minimum and maximum positions
    const minLeft =
      this.canvas.clientWidth - this.element.clientWidth * newScale;
    const maxLeft = 0;
    const minTop =
      this.canvas.clientHeight - this.element.clientHeight * newScale;
    const maxTop = 0;

    // Check if the new position is within bounds, if not, restrict the position and adjust the scale accordingly
    if (
      newX + this.element.clientWidth * newScale < this.canvas.clientWidth &&
      newX > 0 &&
      newY + this.element.clientHeight * newScale < this.canvas.clientHeight &&
      newY > 0
    ) {
      this.position.x = newX;
      this.position.y = newY;
    } else {
      // Keep the current position and adjust the scale to fit within bounds
      const newScaleX = this.canvas.clientWidth / this.element.clientWidth;
      const newScaleY = this.canvas.clientHeight / this.element.clientHeight;
      const minScale = Math.min(newScaleX, newScaleY);

      this.position.x = Math.min(
        maxLeft,
        Math.max(minLeft, this.position.x - centerX * delta + centerX)
      );
      this.position.y = Math.min(
        maxTop,
        Math.max(minTop, this.position.y - centerY * delta + centerY)
      );

      this.scale = minScale;
    }

    this.prevZoomCenter.x = this.zoomCenter.x;
    this.prevZoomCenter.y = this.zoomCenter.y;
    this.zoomCenter.x = (this.prevZoomCenter.x + zoomCenterX) / 2;
    this.zoomCenter.y = (this.prevZoomCenter.y + zoomCenterY) / 2;

    this.scale = newScale;

    // Apply the transformations to the element
    this.element.style.transform = `scale(${this.scale}) translate(${this.position.x}px, ${this.position.y}px)`;
  }

  setEventListeners() {
    // Touch events for pinch zoom
    this.element.addEventListener("touchmove", (e) => {
      e.preventDefault();
      if (e.targetTouches.length == 2) {
        // Pinch zoom
        const p1 = e.targetTouches[0];
        const p2 = e.targetTouches[1];
        const currentDistance = Math.sqrt(
          Math.pow(p2.pageX - p1.pageX, 2) + Math.pow(p2.pageY - p1.pageY, 2)
        );

        if (this.lastDistance !== null) {
          const delta = (currentDistance - this.lastDistance) / 100; // You can adjust the sensitivity
          const zoomCenterX = (p1.pageX + p2.pageX) / 2;
          const zoomCenterY = (p1.pageY + p2.pageY) / 2;
          this.doZoom(delta, zoomCenterX, zoomCenterY);
        }

        this.lastDistance = currentDistance;
      }
    });

    this.element.addEventListener("wheel", (e) => {
      e.preventDefault();
      const delta = -e.deltaY / 100; // You can adjust the sensitivity
      const zoomCenterX = e.clientX;
      const zoomCenterY = e.clientY;
      this.doZoom(delta, zoomCenterX, zoomCenterY);
    });

    // Reset lastDistance when touch ends
    this.element.addEventListener("touchend", () => {
      this.lastDistance = null;
    });

    this.element.addEventListener("pointerdown", (e) => {
      this.prevZoomCenter.x = this.zoomCenter.x;
      this.prevZoomCenter.y = this.zoomCenter.y;
      this.zoomCenter.x = e.clientX;
      this.zoomCenter.y = e.clientY;
      this.positionDelta = { x: 0, y: 0 };
    });
  }
}

// DraggableDiv class for dragging
class DraggableDiv {
  constructor(element, pinchZoom, parentElement) {
    this.element = element;
    this.pinchZoom = pinchZoom;
    this.parentElement = parentElement;

    this.isDragging = false;
    this.position = { x: 0, y: 0 };
    this.lastX = 0;
    this.lastY = 0;

    this.setEventListeners();
  }

  doMove(deltaX, deltaY) {
    // Calculate the bounds of the draggable area based on parent and element dimensions
    const minLeft = 0;
    const maxLeft = this.parentElement.clientWidth - this.element.clientWidth;
    const minTop = 0;
    const maxTop = this.parentElement.clientHeight - this.element.clientHeight;

    // Update the position within the bounds
    this.position.x = Math.min(
      maxLeft,
      Math.max(minLeft, this.position.x + deltaX)
    );
    this.position.y = Math.min(
      maxTop,
      Math.max(minTop, this.position.y + deltaY)
    );

    // Apply the position to the div
    this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px) scale(${this.pinchZoom.scale})`;
  }

  setEventListeners() {
    // Mouse click for dragging
    this.element.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      this.isDragging = true;
      this.lastX = e.clientX;
      this.lastY = e.clientY;

      // Store the original position when dragging starts
      this.originalPosition = { ...this.position };
    });

    // Mouse move for dragging
    window.addEventListener("pointermove", (e) => {
      if (this.isDragging) {
        const deltaX = e.clientX - this.lastX;
        const deltaY = e.clientY - this.lastY;
        this.doMove(deltaX, deltaY);
        this.lastX = e.clientX;
        this.lastY = e.clientY;
      }
    });

    window.addEventListener("pointerup", () => {
      this.isDragging = false;
    });
  }
}

const myCanvas = document.getElementById("mycanvas");
const myDiv = document.getElementById("mydiv");

// Apply both classes to the same div element
const pinchZoom = new PinchZoom(myDiv, myCanvas);
const draggableDiv = new DraggableDiv(myDiv, pinchZoom, myCanvas);
