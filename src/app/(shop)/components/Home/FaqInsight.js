import Insights from "./Insights";
import FAQs from "./FAQs"; 

const FaqInsight = () => {
    return (
        <section className="horizontal-padding flex flex-col xl:flex-row justify-between gap-16 xl:gap-15 2xl:gap-20 mt-16 md:mt-24 lg:mt-[209px]">
            {/* Left Side: FAQs */}
            <div className="w-full xl:w-1/2">
                <FAQs />
            </div>
            
            {/* Right Side: Insights */}
            <div className="w-full xl:w-1/2">
                <Insights />
            </div>
        </section>
    );
};

export default FaqInsight;