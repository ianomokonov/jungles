export function getImagePath(image, file: File) {
  if (file) {
    const reader = new FileReader();

    reader.onload = ({ target }) => {
      // eslint-disable-next-line no-param-reassign
      image.nativeElement.src = target.result.toString();
    };

    reader.readAsDataURL(file);
  }
}
