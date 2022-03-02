import { Box, CircleBadge, StyledOcticon, Text } from "@primer/react";
import type { NextPage } from "next";

interface Props {
  icon: any;
  size?: number;
  count?: number | undefined;
}

const IconPair: NextPage<Props> = ({ icon, count, size }) => {
  return (
    <Box position="relative">
      <Box>
        <StyledOcticon size={size ? size : 25} icon={icon} />
      </Box>
      {count && (
        <>
          <Box position="absolute" bottom="-25%" right="-25%">
            <CircleBadge
              sx={{
                bg: "accent.emphasis",
                color: "fg.onEmphasis",
                width: size ? size * 0.75 : 18,
                height: size ? size * 0.75 : 18,
              }}
            >
              <Text fontWeight="bold" fontSize={size ? size * 0.45 : 11}>
                {count}
              </Text>
            </CircleBadge>
          </Box>
        </>
      )}
    </Box>
  );
};

export default IconPair;
