import Insights from "./Insights";

const { default: FAQs } = require("./FAQs")

const FaqInsight = () => {
    return (
        <section className="flex horizontal-padding jucstify-between gap-10 lg:gap-15 xxl:gap-20 mt-52.25">
            <FAQs />
            <Insights />
        </section>
    )
}

export default FaqInsight;  