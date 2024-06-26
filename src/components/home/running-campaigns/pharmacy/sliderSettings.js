import { WhiteNext, WhitePrev } from "../../visit-again/SliderSettings";

export const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  nextArrow: <WhiteNext />,
  prevArrow: <WhitePrev />,
  responsive: [
    {
      breakpoint: 1450,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 3,
        infinite: false,
      },
    },
    {
      breakpoint: 1250,
      settings: {
        slidesToShow: 3.5,
        slidesToScroll: 2,
        infinite: false,
      },
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 2,
        infinite: false,
      },
    },
    {
      breakpoint: 700,
      settings: {
        slidesToShow: 2.5,
        slidesToScroll: 2,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 550,
      settings: {
        className: 'center',
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '40px',
        initialSlide: 0,
        infinite: true,
      },
    },
    {
      breakpoint: 350,
      settings: {
        className: 'center',
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '20px',
        initialSlide: 0,
        infinite: true,
      },
    },
  ],
};
