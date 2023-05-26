import { useState } from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { useRouter } from "next/router";
import { Box, Button } from "@mui/material";

import { NavItem } from "src/layout/nav-item";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  backgroundColor: "transparent",
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-content": {
    margin: 0,
  },
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({}));

export default function CustomizedAccordions({ data }) {
  const router = useRouter();

  const [expanded, setExpanded] = useState(router.pathname.includes(data.href.toLowerCase()));

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(!expanded);
  };
  return (
    <div>
      <Accordion expanded={expanded} onChange={handleChange()}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Button
            component="a"
            startIcon={data.icon}
            disableRipple
            sx={{
              borderRadius: 1,
              color: "neutral.300",
              fontWeight: "fontWeightBold",
              justifyContent: "flex-start",
              px: 3,
              textAlign: "left",
              textTransform: "none",
              width: "100%",
              "& .MuiButton-startIcon": {
                color: "neutral.400",
              },
              "&:hover": {
                backgroundColor: "rgba(255,255,255, 0.08)",
              },
            }}
          >
            <Box sx={{ flexGrow: 1 }}>{data.title}</Box>
          </Button>
        </AccordionSummary>
        <AccordionDetails>
          {data.submenu.map((item) => {
            return (
              <NavItem key={item.title} icon={item.icon} href={item.href} title={item.title} />
            );
          })}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
