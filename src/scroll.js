//* Back to Top Button with Scroll Progress
let calcScrollValue = () => {
  let scrollProgress = document.getElementById('progress');
  let progressValue = document.getElementById('progress-value');
  let pos = document.documentElement.scrollTop;
  let calcHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  let scrollValue = Number(Math.round((pos * 100) / calcHeight));
  if (pos > 100) {
    scrollProgress.style.display = 'grid';
    progressValue.style.display = 'grid';
  } else {
    scrollProgress.style.display = 'none';
    progressValue.style.display = 'none';
  }
  scrollProgress.addEventListener('click', () => {
    document.documentElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
  scrollProgress.style.background = `conic-gradient(#03cc65 ${scrollValue}%, #d7d7d7 ${scrollValue}%)`;
};
export { calcScrollValue };
