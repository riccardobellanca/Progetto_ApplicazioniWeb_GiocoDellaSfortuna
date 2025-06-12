export const retrieveImage = (nameImage) => {
  try {
    console.log(
      JSON.stringify(
        {
          success: true,
          data: {
            name: nameImage,
            image: `../server/images/${nameImage}`,
          },
        },
        null,
        2
      )
    );
    return {
      success: true,
      data: {
        name: nameImage,
        image: `../server/images/${nameImage}`,
      },
    };
  } catch (error) {
    if (error !== undefined) {
      return {
        success: false,
        data: {
          code: error.code,
          message: error.message,
        },
      };
    } else {
      return {
        success: false,
        data: {
          code: 500,
          message: `Errore nel trovare l'immagine ${nameImage}`,
        },
      };
    }
  }
};
