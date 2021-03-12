import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MobileStepper from "@material-ui/core/MobileStepper";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  header: {
    display: "flex",
    alignItems: "center",
    height: 50,
    paddingLeft: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
  },
  img: {
    overflow: "hidden",
    display: "block",
    width: "100%",
    maxHeight: "70vh",
  },
}));

const ImagesCarouselModal = (props) => {
  const { data, open, handleClose } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = data.length;

  React.useEffect(() => {
    if (window.activeImageinImageCarousel !== undefined) {
      setActiveStep(window.activeImageinImageCarousel);
    }
  }, [window.activeImageinImageCarousel]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  if (!data[activeStep]) {
    return <div></div>;
  } else {
    return (
      <div>
        <Dialog
          open={open}
          fullWidth={true}
          maxWidth="sm"
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          {/* Image View Start */}
          <div className={classes.root}>
            <Paper square elevation={0} className={classes.header}>
              <Typography>
                {data[activeStep].imageurl.split("/").pop()}
              </Typography>
            </Paper>
            <img
              className={`${classes.img} py-5`}
              src={data[activeStep].imageurl}
              alt={data[activeStep].label}
            />
            <MobileStepper
              steps={maxSteps}
              position="static"
              variant="text"
              activeStep={activeStep}
              nextButton={
                <Button
                  size="small"
                  onClick={handleNext}
                  disabled={activeStep === maxSteps - 1}
                >
                  Next
                  {theme.direction === "rtl" ? (
                    <KeyboardArrowLeft />
                  ) : (
                    <KeyboardArrowRight />
                  )}
                </Button>
              }
              backButton={
                <Button
                  size="small"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                >
                  {theme.direction === "rtl" ? (
                    <KeyboardArrowRight />
                  ) : (
                    <KeyboardArrowLeft />
                  )}
                  Back
                </Button>
              }
            />
          </div>
        </Dialog>
      </div>
    );
  }
};

export default ImagesCarouselModal;
