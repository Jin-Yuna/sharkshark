import {
  Badge,
  Box,
  Button,
  Center,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useColorModeValue,
  useDisclosure,
  Image,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getCTproblemAPI } from '../../../api/auth/codingTest';
import { getUserID } from '../../../api/common';
import { CTproblem } from '../../../types/DataTypes';
import { ColorText } from '../../common/ColorText';
import { Paragraph } from '../../common/Paragraph';
import { useDispatch } from 'react-redux';
import {
  setCompStatus,
  setProblemNum,
  setCTPList,
  setTimer,
  setSolvingStatus,
} from '../../../reducers/CTReducer';

export const CodingTestDefault = () => {
  const dispatch = useDispatch();

  const [selected, setSelected] = useState(-1);
  const [CTtime, setCTtime] = useState(0);
  const [problemList, setproblemList] = useState<CTproblem[]>([]);

  const boxBG = useColorModeValue('neutral.0', 'black');
  const { isOpen, onClose, onOpen } = useDisclosure();
  const modalBg = useColorModeValue('neutral.0', 'neutral.500');
  const fontWeight = useColorModeValue(600, 400);

  const sharkjoonImage = useColorModeValue(
    '/assets/logo/sharkjoon_light_logo.png',
    '/assets/logo/sharkjoon_logo.png',
  );

  let problemNum = [2, 3, 4, 5];

  const fetchCTPList = async () => {
    setproblemList(await getCTproblemAPI());
    dispatch(setSolvingStatus(''));
  };

  useEffect(() => {
    fetchCTPList();
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchavgLevel = () => {
    let allLevel = 0;
    for (let problem of problemList) {
      allLevel += problem.level;
    }
    let avgLevel = Math.floor(allLevel / 5);

    setCTtime(Math.floor((avgLevel * 4) / 10) * 10);
  };

  const goCodingTest = async () => {
    dispatch(setCompStatus(1));
    dispatch(setProblemNum(selected + 2));
    dispatch(setTimer(CTtime * (selected + 2)));
    selectedProblem();
    onClose();
  };

  const selectedProblem = () => {
    let newList: CTproblem[] = [];
    newList = problemList.slice(0, selected + 2);
    dispatch(setCTPList(newList));
  };

  useEffect(() => {
    fetchavgLevel();
  }, [fetchavgLevel]);

  return (
    <Box ml="24vw">
      <Paragraph
        title="문제 수 선택"
        description={
          <>
            {getUserID()} 님에게 도움이 될 만한 문제를 준비해 놓았습니다.
            <br />
            난이도에 따라 다르게 설정되는 시간을 고려하여, 문제 개수를 선택해주세요.
          </>
        }
      >
        <Box justifyContent="end" w="420px" mt="6vh">
          <HStack spacing={8} mb="4vh">
            {problemNum.map((item, index) => (
              <Button
                size="lg"
                borderRadius="4px"
                onClick={() => setSelected(index)}
                variant={index === selected ? 'primary' : 'secondary'}
              >
                {item} 문제
              </Button>
            ))}
          </HStack>
          {selected !== -1 ? (
            <HStack float="right">
              <Center bg={boxBG} borderRadius="16px" w="120px" p="4px">
                <ColorText>진행 예정 시간</ColorText>
              </Center>
              <Box fontWeight="700">{CTtime * (selected + 2)} 분</Box>
            </HStack>
          ) : null}
        </Box>
        <Center pos="fixed" bottom="16vh" right="52vh">
          <Button
            isDisabled={selected === -1 ? true : false}
            variant="primary"
            size="cxl"
            onClick={onOpen}
          >
            시작하기
          </Button>
        </Center>

        {/* modal */}
        <Modal size="2xl" isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(45deg)" />
          <ModalContent bg={modalBg}>
            <ModalCloseButton />
            <ModalBody textAlign="center" margin="32px" p={12}>
              <Center mb={2}>
                <Image src={sharkjoonImage} w="240px" />
              </Center>
              <Box fontSize="16px" fontWeight="700" mb={4}>
                <Badge p={1} fontSize="16px" borderRadius="4px" color="white" variant="subtle">
                  <ColorText>사전 안내</ColorText>
                </Badge>
              </Box>

              <Box fontSize="16px" my="10px" fontWeight={fontWeight} mb={10}>
                <Center>
                  문제를 풀고 문제 완료를&nbsp;&nbsp;
                  <Box fontSize="18px" fontWeight="700">
                    <ColorText>'꼭'&nbsp;&nbsp;</ColorText>
                  </Box>
                  눌러주세요.
                </Center>
                코딩 테스트가 종료되면, <br />
                해당 문제에 대한 사용자 실력 분석을 제공해드립니다.
              </Box>

              <Button size="cmd" onClick={goCodingTest}>
                시작하기
              </Button>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Paragraph>
    </Box>
  );
};
