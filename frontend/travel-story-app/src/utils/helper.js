export const validateEmail=(email)=>{
    const regex =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const getInitials=(name)=>{
    if(!name) return "";

    const words = name.split(" ");
    let initials="";

    for (let i = 0; i < words.length; i++) {
      initials += words[i][0];
    }
    return initials.toUpperCase();
};

export const getEmptyCardMessage = (filterType) =>{
  switch (filterType) {
      case "search":
          return " Oops ! No stories found matching your search. Try searching with different words.";
      case "date":
          return " Oops ! No stories found in the given date range. Try searching with different date range.";
  
      default:
          return `Start creating your first Travel Story! Click the 'Add' button to write down your thoughts, ideas and memories What are you waiting for ? Let's get Started!`;
  }
}