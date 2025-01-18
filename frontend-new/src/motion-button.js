const MotionButton = () => {
  return (<motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    whileDrag={{ scale: 0.9, rotate: 10 }}
    drag
  />)
}

export default MotionButton;