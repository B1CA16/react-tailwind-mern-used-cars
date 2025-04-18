import { Link } from "react-router-dom";

const HomeBanner = ({ image, title, description, buttonText, buttonLink }) => {
    return (
        <div
            className="relative rounded-md my-12 bg-cover bg-center  text-white py-0 banner:py-20"
            style={{ backgroundImage: `url(${image})` }}
        >
            <div className="bg-blue-700/70 p-10 backdrop-blur-sm rounded-md mx-auto max-w-4xl text-center">
                <h2 className="text-4xl font-bold mb-4">{title}</h2>
                <p className="text-lg mb-6">{description}</p>
                <Link
                    to={buttonLink}
                    className="bg-yellow-400 text-blue-900 flex items-center justify-center mx-auto w-48 h-12 rounded-md font-semibold hover:scale-105 hover:bg-yellow-500 transition-transform duration-300"
                >
                    {buttonText}
                </Link>
            </div>
        </div>
    );
};

export default HomeBanner;
