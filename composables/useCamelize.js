export default function () {
  function camelize(str) {
    // Split the string at all dash characters
    return (
      str
        .split('-')
        // Convert first char to upper case for each word
        .map(a => a[0].toUpperCase() + a.substring(1))
        // Join all the strings back together
        .join('')
    )
  }

  return {
    camelize,
  }
}
