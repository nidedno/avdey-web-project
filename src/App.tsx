import { AppBar, Box, Button, Dialog, DialogTitle, IconButton, Rating, TextField, Toolbar, Typography } from '@mui/material'
import './App.css'
import MenuIcon from '@mui/icons-material/Menu';
import LogoSvg from "./assets/cat.svg"
import StarIcon from '@mui/icons-material/Star';
import { useState } from 'react';

type Item = Readonly<{
  name: string;
  rating: 1 | 2 | 3 | 4 |5,
  url: string;
}>

const items: readonly Item[] = [
  { name: 'Microsoft Azure AI', rating: 4, url: 'https://azure.microsoft.com/en-ca/solutions/ai/' },
  { name: 'TensorFlow', rating: 5, url: 'https://www.tensorflow.org/' },
  { name: 'Google AI Platform', rating: 4, url: 'https://cloud.google.com/ai-platform/docs/technical-overview/' },
  { name: 'Amazon AI Web service', rating: 3, url: 'https://aws.amazon.com/ru/machine-learning/ai-services/' },
  { name: 'H20 AI Cloud', rating: 2, url: 'https://h2o.ai/platform/ai-cloud/' },
]


function Header() {
  return (<>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{ position: 'absolute '}}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <img className="header__logo" src={LogoSvg} />
            </IconButton>
          </Box>
          <Button color="inherit">JOIN US</Button>
        </Toolbar>
      </AppBar>
    </Box>
  </>)
}

function Body() {
  const [searchFilter, setSearchFilter] = useState('');
  const [minimalRating, setMinimalRating] = useState<number | null>(null);
  return (
    <>
      <div className="body__items">
        <TextField onChange={(event) => setSearchFilter(event.target.value)} sx={{ minWidth: '100%' }} label="Search" />
        <Typography component="legend">Minimal rating</Typography>
        <Rating
          defaultValue={0}
          value={minimalRating}
          onChange={(_, newValue) => {
            setMinimalRating(newValue);
          }}
        />
        { items.map((item, key) => item.name.toLocaleLowerCase().includes(searchFilter.toLocaleLowerCase()) && item.rating >= (minimalRating ?? 0) ? <div className='body__item' key={key}>
          <div> 
            <Typography> {item.name} </Typography>
            <Box>Rating: </Box>
            <Box>
              { Array(item.rating).fill(<StarIcon />) }
            </Box>
          </div>

          <a href={item.url} target='_blank' ><Button>Go to site</Button></a>
        </div> : <></>)}
      </div>
    </>
  )
}

export interface SimpleDialogProps {
  open: boolean;
  name: string;
  onClose: () => void;
}

function FeedbackSendedDialog(props: SimpleDialogProps) {
  const { onClose, name, open } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Thanks for your feedback!</DialogTitle>
      <Typography variant="subtitle1" component="div" sx={{ padding: '20px'}}>
        {name} we will contact you and discuss your feedback shortly
      </Typography>
    </Dialog>
  );
}


function Footer() {
  const [isFeedbackDialogOpened, setIsFeedbackDialogOpened] = useState(false);
  
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<null | string>(null);
  const handleNameChanges = (value: string) => {
    setName(value);

    if (value.length === 0) {
      setNameError('Name is required');
      return
    }

    if (value.length > 50) {
      setNameError('Maximum name length is 50');
      return
    }

    setNameError(null);
  }

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<null | string>(null);
  const handleEmailChanges = (value: string) => {
    setEmail(value);

    if (value.length === 0) {
      setEmailError('Email is required');
      return
    }

    const emailWithRegExp = String(value)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );    

    if (emailWithRegExp == null) {
      setEmailError('Email is not valid')
      return
    }

    setEmailError(null);
  }

  const [feedback, setFeedback] = useState('');

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleEmailChanges(email);
    handleNameChanges(name);

    if (nameError == null && emailError == null) {
      setIsFeedbackDialogOpened(true);
    }
  }


  return <>
    <div className='footer'>
      <form onSubmit={event => handleFormSubmit(event)}>
        <Typography sx={{marginBottom: '5px'}}>Send feedback</Typography>
        <TextField
          required
          error={nameError != null}
          value={name}
          helperText={nameError ?? ''}
          onChange={(event) => handleNameChanges(event.target.value)}
          sx={{ width: '100%', paddingBottom: '10px' }} label="Name" variant="outlined" />
        <TextField
          required
          error={emailError != null}
          value={email}
          helperText={emailError ?? ''}
          onChange={(event) => handleEmailChanges(event.target.value)}
          sx={{ width: '100%', paddingBottom: '10px' }} label="Email" variant="outlined" />
        <TextField
            sx={{ width: '100%', paddingBottom: '10px' }}
            label="Feedback"
            multiline
            variant="outlined"
            value={feedback}
            onChange={({target}) => setFeedback(target.value)}
          />
        <Button sx={{ width: '100%' }} type='submit'>Send</Button>
      </form>
      <FeedbackSendedDialog name={name} open={isFeedbackDialogOpened} onClose={() => setIsFeedbackDialogOpened(false)} />
      <Typography sx={{marginTop: '5px'}}>Age restriction 13+</Typography>
    </div>
  </>
}

function App() {
  return (
    <>
      <Header  />
      <Body/>
      <Footer />
    </>
  )
}

export default App
