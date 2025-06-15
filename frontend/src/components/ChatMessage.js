import React, { useEffect, useRef } from 'react';
import { Box, Flex, Text, Avatar, useColorModeValue, Badge, Button, Spinner } from '@chakra-ui/react';
import { FaPlay, FaStop } from 'react-icons/fa';

/**
 * Component for displaying a single chat message
 * @param {Object} props - Component props
 * @param {string} props.message - Message content
 * @param {string} props.sender - Message sender ('user' or 'assistant')
 * @param {boolean} props.isLoading - Whether the message is in loading state
 * @param {string} props.audioUrl - Optional URL for audio message
 * @param {boolean} props.isHint - Whether this message is a hint
 * @param {boolean} props.isCompact - Whether the message is in compact mode
 */
const ChatMessage = ({ message, sender, isLoading = false, audioUrl, isHint = false, isCompact }) => {
  const isUser = sender === 'user';
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [audioError, setAudioError] = React.useState(null);

  const bgColor = isUser ? 'blue.50' : 'gray.50';
  const textColor = useColorModeValue(
    isUser ? 'blue.800' : isHint ? 'purple.800' : 'gray.800',
    isUser ? 'blue.100' : isHint ? 'purple.100' : 'gray.100'
  );
  const alignSelf = isUser ? 'flex-end' : 'flex-start';
  const maxWidth = isCompact ? '250px' : '80%';

  // Loading animation styles
  const loadingStyle = isLoading
    ? {
        position: 'relative',
        overflow: 'hidden',
        '&:after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '2px',
          width: '30%',
          animation: 'loading 1.5s infinite',
          background: 'brand.500',
        },
        '@keyframes loading': {
          '0%': { left: '0%', width: '30%' },
          '50%': { left: '70%', width: '30%' },
          '100%': { left: '0%', width: '30%' },
        },
      }
    : {};

  // Handle audio play/pause
  const toggleAudio = () => {
    if (!audioRef.current) return;
    
    console.log('Attempting to play/pause audio:', audioUrl);
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // Clear any previous errors
      setAudioError(null);
      
      // Try to play the audio
      audioRef.current.play().catch(err => {
        console.error('Error playing audio:', err);
        setAudioError('Could not play audio. Please click the play button.');
      });
    }
  };

  // Update isPlaying state based on audio events
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    const handleError = (e) => {
      console.error('Audio playback error:', e);
      setIsPlaying(false);
      setAudioError('Error playing audio. Please try again.');
    };

    audioElement.addEventListener('play', handlePlay);
    audioElement.addEventListener('pause', handlePause);
    audioElement.addEventListener('ended', handleEnded);
    audioElement.addEventListener('error', handleError);

    return () => {
      audioElement.removeEventListener('play', handlePlay);
      audioElement.removeEventListener('pause', handlePause);
      audioElement.removeEventListener('ended', handleEnded);
      audioElement.removeEventListener('error', handleError);
    };
  }, []);

  // Fix URL if needed - ensure it starts with /api
  useEffect(() => {
    if (audioUrl && audioUrl.trim() !== '') {
      console.log('Initializing audio with URL:', audioUrl);
      
      // If the URL doesn't start with / or http, ensure it starts with /api
      if (audioRef.current) {
        const formattedUrl = audioUrl.startsWith('/') || audioUrl.startsWith('http') 
          ? audioUrl 
          : `/api/audio/response/${audioUrl}`;
          
        console.log('Using formatted audio URL:', formattedUrl);
        audioRef.current.src = formattedUrl;
        
        // Attempt to load the audio
        audioRef.current.load();
      }
    }
  }, [audioUrl]);

  // Debug when component renders
  useEffect(() => {
    if (audioUrl) {
      console.log('ChatMessage rendered with audioUrl:', audioUrl);
    }
  }, [audioUrl]);

  return (
    <Box
      alignSelf={alignSelf}
      maxW={maxWidth}
      bg={bgColor}
      p={isCompact ? 2 : 4}
      borderRadius="lg"
      boxShadow="sm"
    >
      {isHint && (
        <Badge colorScheme="purple" mb={2} fontSize={isCompact ? "xs" : "sm"}>
          Hint
        </Badge>
      )}
      <Text fontSize={isCompact ? "sm" : "md"} whiteSpace="pre-wrap">
        {message}
      </Text>
      {audioUrl && (
        <Box mt={2}>
          <audio controls style={{ width: '100%' }}>
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </Box>
      )}
      {isLoading && (
        <Flex mt={2} justifyContent="center">
          <Spinner size={isCompact ? "xs" : "sm"} color="blue.500" />
        </Flex>
      )}
    </Box>
  );
};

export default ChatMessage; 