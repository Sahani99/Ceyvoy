export const fromBottomToTop = {
  initial: {
    y: 100,
    opacity: 0,
    transition: {
      duration: 1,
    },
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 1,
    },
  },
};

export const fromTopToBottom = {
  initial: {
    y: -100,
    opacity: 0,
    transition: {
      duration: 1,
    },
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 1,
    },
  },
};

export const fromLeftToRight = {
  initial: {
    x: -100,
    opacity: 0,
    transition: {
      duration: 1,
    },
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 1,
    },
  },
};

export const fromRightToLeft = {
  initial: {
    x: 100,
    opacity: 0,
    transition: {
      duration: 1,
    },
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 1,
    },
  },
};

export const fadeIn = {
  initial: {
    opacity: 0,
    transition: {
      duration: 1,
    },
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 1,
    },
  },
};

export const fadeOut = {
  initial: {
    opacity: 1,
    transition: {
      duration: 1,
    },
  },
  animate: {
    opacity: 0,
    transition: {
      duration: 1,
    },
  },
};
