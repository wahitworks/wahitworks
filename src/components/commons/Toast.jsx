import { motion, AnimatePresence } from "framer-motion";
import './Toast.css';

function Toast({ show, message }) {

  return (    
    <AnimatePresence>
      {show && (
        <>
        {/* 반투명배경 */}
        <motion.div className="toast-background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}       
        ></motion.div>
        {/* 토스트 */}
        <div className="toast-container">
          <motion.div className="toast-comment"
            initial={{ opacity: 0, y: 20 }} // 초기 상태 (투명하고 살짝 아래에)
            animate={{ opacity: 1, y: 0 }} // 나타날 때의 상태 (불투명하고 제자리로) 
            exit={{ opacity: 0, y: 20 }} // 사라질 때의 상태 (투명하고 살짝 아래로)
            transition={{ duration: 0.3 }}            
          >
          {message}
          </motion.div>
        </div>
      </>
      )}
    </AnimatePresence>   
  );
}

export default Toast;