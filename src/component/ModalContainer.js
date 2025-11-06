import styled from "styled-components";
import { style } from "../styles/styleCode";

const POSITION_UNIT = "px";

/**
 * ModalContainer - Reusable modal container component
 *
 * Provides a consistent styled container for all modal types with
 * position-based visibility management.
 *
 * @param {React.ReactNode} children - Modal content
 * @param {boolean} visibility - Whether modal is visible
 * @param {number} top - Top position in pixels
 * @param {number} left - Left position in pixels
 * @param {string} testId - Test ID for testing (optional)
 */
export default function ModalContainer({
  children,
  visibility,
  top,
  left,
  testId,
}) {
  return (
    <Container
      visibility={String(visibility)}
      top={top + POSITION_UNIT}
      left={left + POSITION_UNIT}
      data-testid={testId}
    >
      {children}
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  top: ${(props) => props.top};
  left: ${(props) => props.left};

  padding: 10px 20px;
  border-radius: ${style.borderRadius};
  font-size: 1rem;

  background-color: ${(props) => props.theme.chartModal};
  visibility: ${(props) =>
    props.visibility === "true" ? "visible" : "hidden"};
`;
