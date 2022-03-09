import ArtistQuestionScreen from '../artist-question-screen/artist-question-screen';
import GenreQuestionScreen from '../genre-question-screen/genre-question-screen';
import Mistakes from '../mistakes/mistakes';
import withAudioPlayer from '../../hocs/with-audio-player/with-audio-player';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkUserAnswer, incrementStep } from '../../store/action';
import { AppRoute, GameType, MAX_MISTAKE_COUNT } from '../../const';
import { Question, QuestionArtist, QuestionGenre, UserAnswer } from '../../types/question';
import { getQuestions } from '../../store/game-data/selectors';
import { getMistakeCount, getStep } from '../../store/game-process/selectors';

const ArtistQuestionScreenWrapped = withAudioPlayer(ArtistQuestionScreen);
const GenreQuestionScreenWrapped = withAudioPlayer(GenreQuestionScreen);

function GameScreen(): JSX.Element {
  const step = useSelector(getStep);
  const mistakes = useSelector(getMistakeCount);
  const questions = useSelector(getQuestions);

  const dispatch = useDispatch();

  const onUserAnswer = (currentQuestion: Question, answer: UserAnswer) => {
    dispatch(incrementStep());
    dispatch(checkUserAnswer(currentQuestion, answer));
  };

  const question = questions[step];

  if (mistakes >= MAX_MISTAKE_COUNT) {
    return (
      <Redirect to={AppRoute.Lose}/>
    );
  }

  if (step >= questions.length || !question) {
    return (
      <Redirect to={AppRoute.Result}/>
    );
  }

  switch (question.type) {
    case GameType.Artist:
      return (
        <ArtistQuestionScreenWrapped
          key={step}
          question={question as QuestionArtist}
          onAnswer={onUserAnswer}
        >
          <Mistakes count={mistakes}/>
        </ArtistQuestionScreenWrapped>
      );
    case GameType.Genre:
      return (
        <GenreQuestionScreenWrapped
          key={step}
          question={question as QuestionGenre}
          onAnswer={onUserAnswer}
        >
          <Mistakes count={mistakes}/>
        </GenreQuestionScreenWrapped>
      );
    default:
      return <Redirect to={AppRoute.Root}/>;
  }
}

export default GameScreen;
