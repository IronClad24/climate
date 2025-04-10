import { BackgroundCircles, Gradient } from "./design/Hero";

import Button from "./Button";
import Notification from "./Notification";
import { ScrollParallax } from "react-just-parallax";
import Section from "./Section";
import { useRef } from "react";

// import { actionIcon, climateIcon, forecastIcon, weatherIcon } from "../constants";







// Feature icons (you'd need to add these to your assets and constants)


const Features = () => {
    const parallaxRef = useRef(null);

    const features = [
        {
            title: "Real-Time Weather Insights",
            description: "Get instant updates on current weather conditions using AI-powered analysis.",
            // icon: weatherIcon,
            notification: "Live Weather Data",
            position: "bottom-[7.5rem] -left-[5.5rem]"
        },
        {
            title: "Advanced Climate Forecasting",
            description: "Predict future climate trends with our cutting-edge machine learning models.",
            // icon: forecastIcon,
            notification: "30-Day Forecast",
            position: "bottom-[11rem] -right-[5.5rem]"
        },
        {
            title: "Climate Impact Analysis",
            description: "Understand how your actions affect the planet with personalized insights.",
            // icon: climateIcon,
            notification: "Carbon Impact",
            position: "top-[8rem] -left-[5.5rem]"
        },
        {
            title: "Actionable Sustainability Steps",
            description: "Receive practical recommendations to reduce your environmental footprint.",
            // icon: actionIcon,
            notification: "Green Actions",
            position: "top-[12rem] -right-[5.5rem]"
        }
    ];

    return (
        <Section
            className="pt-[8rem] -mt-[5.25rem] overflow-hidden"
            crosses
            crossesOffset="lg:translate-y-[5.25rem]"
            customPaddings="pt-[10rem] -mt-[5.25rem]"
            id="features"
        >
            <div className="container relative" ref={parallaxRef}>
                <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[4rem] md:mb-20 lg:mb-[6rem]">
                    <h1 className="h1 mb-6">
                        Discover AIHorizon's Powerful Features
                    </h1>
                    <p className="body-1 max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8">
                        Harness the power of AI to understand weather patterns and shape a sustainable future
                    </p>
                    <Button href="/signup" white>
                        Start Exploring
                    </Button>
                </div>

                <div className="relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24">
                    <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient">
                        <div className="relative bg-n-8 rounded-[1rem] p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {features.map((feature, index) => (
                                    <div key={index} className="relative">
                                        <div className="flex items-center mb-4">
                                            <img 
                                                src={feature.icon} 
                                                width={32} 
                                                height={32} 
                                                alt={feature.title}
                                                className="mr-3"
                                            />
                                            <h3 className="h3 text-n-1">{feature.title}</h3>
                                        </div>
                                        <p className="body-2 text-n-2 mb-4">
                                            {feature.description}
                                        </p>

                                    </div>
                                ))}
                            </div>
                        </div>
                        <Gradient />
                    </div>
                    <BackgroundCircles />
                </div>
            </div>
        </Section>
    );
};

export default Features;