'use client';
import { useState } from "react";
import ProductFilterSidebar from "./components/ProductFilterSidebar";



const ProductsPage = () => {
    const img1 = "/images/CatBanner.webp";
    const img2 = "/images/Rings.webp";
    const star = "/icons/star.svg";
    const BlackShare = "/icons/BlackShare.svg";
    const BlackHeart = "/icons/BlackHeart.svg";



    return (
        <div className="grid grid-cols-[1fr_0.7fr] min-h-screen gap-10 horizontal-padding mt-[100px]">

            <div>
                <h1 className="product-name">Pendant Necklace
                    with Crystals</h1>
                <h1 className="product-price mt-10">₹400</h1> 
                <div className="mt-15 flex gap-4">
                    <p className="title-main text-[#BF8F5F] cursor-pointer">SUNSHINE SIGNATURE COLLECTION</p>
                    <p className="title-main text-[#BF8F5F]">|</p>
                    <div>
                        <img src={star} alt="star icon" className="inline-block" />
                        <img src={star} alt="star icon" className="inline-block" />
                        <img src={star} alt="star icon" className="inline-block" />
                        <img src={star} alt="star icon" className="inline-block" />
                        <img src={star} alt="star icon" className="inline-block" />
                    </div>
                    <p className="title-des">(20 Reviews)</p>
                </div>   
                <div className="mt-5">
                    <img src={BlackShare} alt="share icon" className="inline-block mt-5 cursor-pointer" />
                    <img src={BlackHeart} alt="heart icon" className="inline-block mt-5 ml-5 cursor-pointer" />
                </div>
                <div className="my-10 w-full h-px bg-[#222222] opacity-10"/>
                <div>
                    <div className="border-[2px] border-[#BF8F5F] h-[50px] w-[100px] flex items-center justify-center cursor-pointer">
                            <p className="buy-cart-btn">BUY NOW</p>
                    </div>
                </div>
            </div>
            <div>
                <div className="h-[600px] w-full bg-[#FCF6F2] p-20">
                    <img src={img2} alt="product image" className="h-full w-full object-cover" />
                </div>
                <div className="flex mt-5 gap-5">
                    <div className="flex h-[200px]  bg-[#FCF6F2] w-[50%] p-2">
                        <img src={img2} alt="product image" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex h-[200px]  bg-[#FCF6F2] w-[50%] p-2">
                        <img src={img2} alt="product image" className="h-full w-full object-cover" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;