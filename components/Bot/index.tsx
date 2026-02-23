"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { chatWithBot } from "@/app/actions/chat";
import { useBotScene } from "./useBotScene";
import { useBotEyes, EyeState } from "./useBotEyes";
import { useBotInteractions } from "./useBotInteractions";
import { BotChat } from "./BotChat";

export default function Bot() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [eyeState, setEyeState] = useState<EyeState>("open");

  const mouseRef = useRef(new THREE.Vector2());
  const isHoveredRef = useRef(false);
  const isProcessingRef = useRef(false);
  const isCooldownRef = useRef(false);
  const chatOpenRef = useRef(false);
  const inputRef = useRef(input);
  const nextBlinkTimeRef = useRef(2);
  const [isGlobalModalOpen, setIsGlobalModalOpen] = useState(false);
  const isGlobalModalOpenRef = useRef(false);

  useEffect(() => {
    const checkModal = () => {
      const isHidden =
        document.body.style.overflow === "hidden" ||
        document.body.style.cursor === "wait";

      setIsGlobalModalOpen(isHidden);
      isGlobalModalOpenRef.current = isHidden;
    };

    const observer = new MutationObserver(checkModal);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });
    checkModal();

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    inputRef.current = input;
  }, [input]);

  useEffect(() => {
    chatOpenRef.current = chatOpen;
  }, [chatOpen]);

  useEffect(() => {
    isProcessingRef.current = isProcessing;
  }, [isProcessing]);

  useEffect(() => {
    isCooldownRef.current = isCooldown;
  }, [isCooldown]);

  const { eyeContextRef, eyeCanvasRef, eyeTextureRef, clockRef, robotRef } =
    useBotScene({
      containerRef,
      mouseRef,
      isHoveredRef,
      isProcessingRef,
      isCooldownRef,
      chatOpenRef,
      isGlobalModalOpenRef,
    });

  const { eyeStateRef } = useBotEyes({
    eyeContextRef,
    eyeCanvasRef,
    eyeTextureRef,
    eyeState,
    clockRef,
  });

  const {
    handleMouseEnter: interactionMouseEnter,
    handleMouseLeave: interactionMouseLeave,
    isRightClickingRef,
  } = useBotInteractions({
    containerRef,
    mouseRef,
    setEyeState,
    isProcessing,
    isCooldown,
    setChatOpen,
    isHoveredRef,
    robotRef,
    setBubbleText,
  });

  useEffect(() => {
    const checkBlink = () => {
      if (isGlobalModalOpen) return;
      const t = clockRef.current.getElapsedTime();
      if (
        eyeState === "open" &&
        !isRightClickingRef.current &&
        !isProcessing &&
        !isCooldown &&
        t > nextBlinkTimeRef.current
      ) {
        setEyeState("closed");
        gsap.delayedCall(0.15, () => {
          if (
            eyeStateRef.current === "closed" &&
            !isRightClickingRef.current &&
            !isProcessing &&
            !isCooldown
          ) {
            setEyeState("open");
          }
          nextBlinkTimeRef.current = t + 3 + Math.random() * 4;
        });
      }
    };

    gsap.ticker.add(checkBlink);
    return () => gsap.ticker.remove(checkBlink);
  }, [eyeState, isProcessing, isCooldown]);

  const handleMouseEnter = () => {
    interactionMouseEnter();
  };

  const handleMouseLeave = () => {
    interactionMouseLeave();
    if (!input && !isProcessing && !isCooldown) {
      setChatOpen(false);
    }
  };

  const handleContainerClick = () => {
    if (!chatOpen) {
      setChatOpen(true);
      isHoveredRef.current = true;
    }
  };

  const handleCloseChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setChatOpen(false);
    isHoveredRef.current = false;
  };

  const handleDoubleClick = () => {
    setEyeState("angry");
    setBubbleText("Hey! Personal space! 🤖");
    setTimeout(() => {
      setBubbleText(null);
      setEyeState("open");
    }, 2000);
  };

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMsg = input;
    setInput("");
    setIsProcessing(true);
    setEyeState("thinking");
    setBubbleText("Thinking...");

    try {
      const response = await chatWithBot(userMsg);
      setBubbleText(response);
      setEyeState("happy");
    } catch (error) {
      setBubbleText("Error connecting to brain.");
      setEyeState("error");
    } finally {
      setIsProcessing(false);
      setIsCooldown(true);
      setTimeout(() => {
        setIsCooldown(false);
        if (eyeStateRef.current === "happy") {
          setEyeState("open");
        }
        if (!isHoveredRef.current && !inputRef.current) {
          setChatOpen(false);
        }
      }, 2000);
    }
  };

  const isMinimized = !chatOpen && !isHoveredRef.current;

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ease-in-out w-[280px] h-[280px] sm:w-[450px] sm:h-[450px] ${
        chatOpen
          ? "bottom-0 right-0 sm:bottom-10"
          : "-bottom-12 -right-20 sm:-bottom-20 sm:-right-36"
      }`}
      style={{
        pointerEvents: isMinimized ? "none" : "auto",
        display: isGlobalModalOpen ? "none" : "block",
        opacity: isGlobalModalOpen ? 0 : 1,
      }}
      onMouseEnter={
        !isMinimized && !isGlobalModalOpen ? handleMouseEnter : undefined
      }
      onMouseLeave={
        !isMinimized && !isGlobalModalOpen ? handleMouseLeave : undefined
      }
    >
      {chatOpen && (
        <div className="absolute -bottom-[200px] -right-[200px] w-[150%] h-[150%] bg-transparent -z-10" />
      )}

      <BotChat
        chatOpen={chatOpen}
        bubbleText={bubbleText}
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        handleCloseChat={handleCloseChat}
        isProcessing={isProcessing}
      />

      <div
        ref={containerRef}
        className="w-full h-full"
        onDoubleClick={handleDoubleClick}
        onClick={!chatOpen ? handleContainerClick : undefined}
      />

      {isMinimized && (
        <div
          className="absolute bottom-16 right-16 sm:bottom-28 sm:right-32 w-24 h-24 sm:w-32 sm:h-32 cursor-pointer"
          style={{ pointerEvents: "auto" }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onDoubleClick={handleDoubleClick}
          onClick={handleContainerClick}
        />
      )}
    </div>
  );
}
