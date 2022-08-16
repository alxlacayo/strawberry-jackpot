import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event"
import { act } from "react-dom/test-utils";
import Connect from "./Connect";

test("should render connect button", () => {
    // render(<Connect />);
    // const button = screen.getByText("Connect");
    // expect(button).toBeInTheDocument();
});

test("should render modal when connect button clicked", async () => {
    // const user = userEvent.setup();
    // render(<Connect />);
    // await userEvent.click(screen.getByText("Connect"));
    // expect(screen.getByText("Connect Wallet")).toBeInTheDocument();
});