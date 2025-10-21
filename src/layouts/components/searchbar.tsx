import type { BoxProps } from '@mui/material/Box';

import { useNavigate } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';
import { useState, useCallback, forwardRef } from 'react';

import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
// import SvgIcon from '@mui/material/SvgIcon';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { TransitionProps } from '@mui/material/transitions';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------
const Transition = forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
  ) => <Slide direction="down" ref={ref} {...props} />,
);

// export function Searchbar({ sx, ...other }: BoxProps) {
//   const theme = useTheme();

//   const [open, setOpen] = useState(false);

//   const handleOpen = useCallback(() => {
//     setOpen((prev) => !prev);
//   }, []);

//   const handleClose = useCallback(() => {
//     setOpen(false);
//   }, []);

//   return (
//     <ClickAwayListener onClickAway={handleClose}>
//       <div>
//         {!open && (
//           <IconButton onClick={handleOpen}>
//             <Iconify icon="eva:search-fill" />
//           </IconButton>
//         )}

//         <Slide direction="down" in={open} mountOnEnter unmountOnExit>
//           <Box
//             sx={{
//               top: 0,
//               left: 0,
//               zIndex: 99,
//               width: '100%',
//               display: 'flex',
//               position: 'absolute',
//               alignItems: 'center',
//               px: { xs: 3, md: 5 },
//               boxShadow: theme.vars.customShadows.z8,
//               height: {
//                 xs: 'var(--layout-header-mobile-height)',
//                 md: 'var(--layout-header-desktop-height)',
//               },
//               backdropFilter: `blur(6px)`,
//               WebkitBackdropFilter: `blur(6px)`,
//               backgroundColor: varAlpha(theme.vars.palette.background.defaultChannel, 0.8),
//               ...sx,
//             }}
//             {...other}
//           >
//             <Input
//               autoFocus
//               fullWidth
//               disableUnderline
//               placeholder="Search…"
//               startAdornment={
//                 <InputAdornment position="start">
//                   <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
//                 </InputAdornment>
//               }
//               sx={{ fontWeight: 'fontWeightBold' }}
//             />
//             <Button variant="contained" onClick={handleClose}>
//               Search
//             </Button>
//           </Box>
//         </Slide>
//       </div>
//     </ClickAwayListener>
//   );
// }
export function Searchbar() { // Removed props, as we are navigating
  const navigate = useNavigate(); // 2. Initialize navigate
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(''); // This state will hold the search term

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }, []);

  // 3. Create the submit handler
  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Stop the form from reloading the page
    if (search.trim()) {
      // Navigate to the food page with the search term as a URL query parameter
      navigate(`/food?search=${encodeURIComponent(search.trim())}`);
      setSearch(''); // Clear the search bar
      handleClose(); // Close the dialog
    }
  };

  return (
    <>
      <Tooltip title="Search">
        <IconButton
          onClick={handleOpen}
          sx={{
            width: 40,
            height: 40,
            bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
            borderColor: (theme) => alpha(theme.palette.grey[500], 0.16),
          }}
        >
          <Iconify width={20} icon="eva:search-fill" />
          
        </IconButton>
      </Tooltip>

      <Dialog
        fullWidth
        maxWidth="xs"
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            mt: -10,
            pt: 1,
            borderRadius: 2,
            overflow: 'unset',
            boxShadow: (theme) => theme.customShadows.z20,
            bgcolor: (theme) => alpha(theme.palette.background.paper, 0.9),
          },
        }}
      >
        {/* 4. Wrap the InputBase with a form and add the onSubmit handler */}
        <Box sx={{ p: 2, pt: 1.5 }} component="form" onSubmit={handleSearchSubmit}>
          <InputBase
            value={search}
            onChange={handleSearchChange} // Use the state handler
            autoFocus
            fullWidth
            placeholder="Search..."
            startAdornment={
              <InputAdornment position="start">
                  <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
            sx={{
              height: 40,
              '& .MuiInputBase-input': {
                py: '8px',
              },
            }}
          />
        </Box>
        {/* We no longer need the 'results' or 'loading' section here */}
      </Dialog>
    </>
  );
}