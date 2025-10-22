import "./InfoTooltip.css"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion";
  import { IoInformationCircleOutline } from "react-icons/io5";

const InfoTooltip = ({
  message,
  autoCloseDelay = 2500,
  top = '0',
  bottom,
  left,
  right,
  width = '50%'
}) => {
  // 정보 툴팁 표시 여부
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(true);
    setTimeout(() => setShow(false), autoCloseDelay)
  }

  // 위치 스타일 객체
  const positionStyle = {
    top,
    bottom,
    left,
    right,
    width
  };

  return (
    <>
      <IoInformationCircleOutline
        className="info-tooltip-icon"
        onClick={() => handleShow()}
      />
      <AnimatePresence>
        {show && (
          <motion.div
            className="info-tooltip-box"
            style={positionStyle}
            onClick={() => setShow(false)}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default InfoTooltip;