import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { IFormInput } from "../models/FormInputTypes";
import FormStep from "../models/FormStep";
import UseStepsHandlerReturnType from "../models/useHandlerReturnType";
import FormNavigationButtons from "../partials/FormNavigationButtons";
import { StyledProgressBar } from "./StyledProgressBar";

const StyledBox = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  margin: "auto",
  gap: theme.spacing(0),
  padding: theme.spacing(0),
  // backdropFilter: "blur(10px)",
  background: theme.palette.common.white,
  borderRadius: theme.shape.borderRadius,
  boxShadow: `0px 5px 15px rgba(4, 75, 217, 0.3)`,
  width: "min(61.8vw, 95%)",
  border: "none",
  overflow: "hidden",
}));

interface Props extends UseStepsHandlerReturnType {
  methods: UseFormReturn<IFormInput>;
  currentStep: number;
  steps: FormStep[];
  onSubmit: (formData: IFormInput) => Promise<void>;
  submittedAlreadyState: boolean;
  children: React.ReactNode | React.ReactNode[];
}

function StyledProgressiveFormBox({
  methods,
  children,
  currentStep,
  steps,
  onSubmit,
  handleNextStep,
  handlePreviousStep,
}: Props) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (
      e.key === "Enter" &&
      /* Do not prevent default behavior in the last step */
      currentStep < steps.length - 1
    ) {
      e.preventDefault();
      handleNextStep();
    }
    // Else: submit form
  };

  const handleSubmit = () => {
    // Call the handleNextStep + the on-submit-only behavior + wrap it up inside the RHF Submit method.
    handleNextStep();
    return methods.handleSubmit(onSubmit);
  };

  return (
    <StyledBox>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          style={{ padding: "2rem" }}
        >
          {children}
          <FormNavigationButtons
            currentStep={currentStep}
            {...{ handlePreviousStep, handleNextStep }}
            maxSteps={steps.length}
          />
        </form>
      </FormProvider>
      <StyledProgressBar currentStep={currentStep} totalSteps={steps.length} />
    </StyledBox>
  );
}

export default StyledProgressiveFormBox;
