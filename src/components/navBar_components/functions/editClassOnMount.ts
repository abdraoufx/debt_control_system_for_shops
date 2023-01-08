export const editClassOnMount = (
  eleClassName: string,
  setSelectedLink: React.Dispatch<React.SetStateAction<string>>,
  selectedLink: string
) => {
  document.querySelector(".selected")?.classList.remove("selected");
  document.querySelector(`${eleClassName}`)?.classList.add("selected");

  setSelectedLink(selectedLink);
};
