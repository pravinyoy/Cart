import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import { NextArrow } from "./NextArrow";
import { PrevArrow } from "./PrevArrow";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [detailedCart, setDetailedCart] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await axios.get("https://dummyjson.com/cart/1");
        setCart(response.data.products);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCartData();

    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const detailedProducts = await Promise.all(
          cart.map(async (item) => {
            const response = await axios.get(`https://dummyjson.com/products/${item.id}`);
            return { ...item, ...response.data };
          })
        );
        setDetailedCart(detailedProducts);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    if (cart.length > 0) {
      fetchProductDetails();
    } else {
      setDetailedCart([]);
    }
  }, [cart]);

  const removeItem = (id) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== id);
      return updatedCart;
    });
  };

  const resetCart = () => {
    setCart([]);
    setDetailedCart([]);
  };

  const customPaging = (i) => (
    <div>
      <p className="custom-nav">
        {detailedCart[i] && detailedCart[i].title}
      </p>
    </div>
  );

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    customPaging: customPaging,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    appendDots: (dots) => {
      const start = Math.floor(currentSlide / 3) * 3;
      const end = start + 3;
      return (
        <div >
          <ul>
            {dots.slice(start, end)}
          </ul>
        </div>
      );
    },
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      
      <div className="cart-wrapper" key={detailedCart.length}>
        <header>
            <span>Cart: {detailedCart.length} items</span>
        </header>
        {detailedCart.length > 0 ? (
          isMobileView ? (
            <div className="cart-contain">
              {detailedCart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-container">
                    <h3>{item.title}</h3>
                    <p className="item-price">${item.price}</p>
                    <p>{item.description}</p>
                    <button onClick={() => removeItem(item.id)} className="remove-button">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Slider {...settings} className="cart-contain">
              {detailedCart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-container">
                    <h3>{item.title}</h3>
                    <p className="item-price">${item.price}</p>
                    <p>{item.description}</p>
                    <button onClick={() => removeItem(item.id)} className="remove-button">
                      Remove Product
                    </button>
                  </div>
                </div>
              ))}
            </Slider>
          )
        ) : (
          <p className="cart-empty">No items in the cart.</p>
        )}
        <div className="reset-wrapper">
            <button onClick={resetCart} className="reset-button">
            Reset
            </button>
        </div>
      </div>
      
    </>
  );
};

export default Cart;
