import React from "react";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Box from '@material-ui/core/Box';
import Slider from "@mui/material/Slider";


import styles from "./projcard.module.css";

// function valuetext(value) {
//     return `${value}`;
//   }

const marks = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 10,
      label: '10',
    },
];

const HexLabsCard = styled(Card)({
    minWidth: 636,
    maxWidth: 636,
    boxShadow: '0 8px 24px 0 rgb(33, 36, 41, 10%)',
    border: '1px solid #e6e6e6',
    borderRadius: '4px',
})

const CustomContent = styled(CardContent)({
    margin: "5px",
})


const BlueSlider = styled(Slider)({
    marginTop: '40px',
    color: '#7B69EC',
    height: 4,
    minWidth: '570px',
    "& .MuiSlider-track": {
      border: "none"
    },
    "& .MuiSlider-thumb": {
      height: 16,
      width: 16,
      backgroundColor: "#fff",
      border: "2px solid currentColor",
      "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
        boxShadow: "inherit"
      },
      "&:before": {
        display: "none"
      }
    }
})

const ProjCard: React.FC = () => (
    <div>
        <HexLabsCard>
            <CustomContent>
                <Typography>
                    <p className={styles.title}>Impact</p>
                </Typography>
                <Typography sx={{ mb: 1.5 }}>
                    <p className={styles.category}>Impatient Health</p>
                </Typography>
                <Typography className={styles.body}>
                This product is aimed towards solving a health issue that affects 
                a wide range of population or a condition that has been historically 
                difficult to treat, and the product is potentially capable of achieveing 
                its goal.
                </Typography>
                <Box sx={{ width: 500 }}>
                    <BlueSlider
                        aria-label="Score"
                        defaultValue={0}
                        // getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        step={1}
                        marks={marks}
                        min={0}
                        max={10}
                    />
                </Box>
            </CustomContent>
        </HexLabsCard>
    </div>    
);

export default ProjCard;
