import React, {useState} from 'react'
import VideoIcon from '@material-ui/icons/Movie';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import MovieIcon from '@material-ui/icons/Movie';
import InsertLinkIcon from '@material-ui/icons/InsertLink';
import {
  Grid,
  Box,
  Container,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Dialog,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  OutlinedInput,
  FormHelperText,
  FormControl,
  InputLabel,
  ClickAwayListener,
} from '@material-ui/core';

function VideoToggle(props) {
  const [state, setState] = React.useState({
    ...JSON.parse(JSON.stringify(vars.default_state)),
  });  
  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const {
    desc_input_is_focused,
    video_upload_dialog_open,
    media_upload,
    categories,
    tag_suggestion,
    tag_suggestion_open,
    select_video_file,
    publish_types,
    publish_visible_to_suggestion_open,
    publish_visible_to_suggestion,
  } = state;  
  return (
    <div>
      <Dialog
        PaperProps={{
          style: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}
        open={video_upload_dialog_open}
        onClose={async () =>
          handleSetState({
            ...(await handleVideoFieldCancel(refs, props, state)),
            video_upload_dialog_open: false,
          })
        }
        aria-labelledby="video upload dialog"
      >
        <Container
          className={clsx(
            classes.containerStyle,
            classes.videoInputDialogContainerStyle,
          )}
        >
          <Card
            className={clsx(
              classes.cardStyle,
              classes.videoInputDialogCardStyle,
            )}
          >
            <CardActionArea>
              <CardContent>
                <div className={classes.videoInputDialogControlSectionStyle}>
                  <CustomButton
                    className={classes.videoInputDialogControlButtonStyle}
                    primaryButtonStyle={!select_video_file}
                    secondaryButtonStyle={select_video_file}
                    size="medium"
                    onClick={_ => handleSetState({ select_video_file: false })}
                  >
                    <div
                      className={
                        classes.videoInputDialogControlButtonUseTextDescStyle
                      }
                    >
                      {t('createProject.inputs.video.dialogURLToggle')}
                    </div>
                    <InsertLinkIcon
                      className={
                        classes.videoInputDialogControlButtonUseIconDescStyle
                      }
                    />
                  </CustomButton>
                  <CustomButton
                    className={classes.videoInputDialogControlButtonStyle}
                    primaryButtonStyle={select_video_file}
                    secondaryButtonStyle={!select_video_file}
                    size="medium"
                    onClick={_ =>
                      handleSetState(
                        handleSelectVideoFileChecked(
                          refs.video_file_el.current,
                        ),
                      )
                    }
                  >
                    <div
                      className={
                        classes.videoInputDialogControlButtonUseTextDescStyle
                      }
                    >
                      {t('createProject.inputs.video.dialogFileToggle')}
                    </div>
                    <MovieIcon
                      className={
                        classes.videoInputDialogControlButtonUseIconDescStyle
                      }
                    />
                  </CustomButton>
                </div>
                <Grid container spacing={1} alignItems="flex-end">
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    className={clsx(
                      common_classes.marginTop1em,
                      classes.videoInputDialogBodyGridStyle,
                    )}
                  >
                    {!select_video_file ? (
                      <FormControl
                        className={clsx(
                          classes.margin,
                          classes.textField,
                          classes.videoInputDialogURLFormControlStyle,
                        )}
                        variant="outlined"
                        size="small"
                      >
                        <InputLabel
                          className={classes.customLabelStyle}
                          htmlFor="url-input"
                        >
                          {t('createProject.inputs.video.dialogURLFieldLabel')}
                        </InputLabel>
                        <OutlinedInput
                          ref={refs.video_el}
                          className={classes.customInputStyle}
                          type="text"
                          name="url-input"
                          labelWidth={calculateLabelWidth(
                            t('createProject.inputs.video.dialogURLFieldLabel'),
                            document,
                          )}
                          placeholder="https://youtube.com/..."
                          onChange={async e =>
                            handleSetState(
                              await handleVideoFieldChange(
                                e,
                                refs,
                                props,
                                state,
                                handleSetState,
                              ),
                            )
                          }
                        />
                      </FormControl>
                    ) : null}
                    {select_video_file ? (
                      <p className={classes.videoFileName}>
                        {refs.video_file_el.current?.files?.[0]
                          ? refs.video_file_el.current?.files?.[0]?.name
                          : t('createProject.inputs.video.dialogFileToggle')}
                      </p>
                    ) : null}
                    <CustomButton
                      className={classes.videoInputDialogActionButtonStyle}
                      secondaryButtonStyle
                      variant="outlined"
                      size="medium"
                      onClick={async () =>
                        handleSetState({
                          ...(await handleVideoFieldCancel(refs, props, state)),
                          video_upload_dialog_open: false,
                        })
                      }
                    >
                      <CloseIcon />
                    </CustomButton>

                    <CustomButton
                      className={classes.videoInputDialogActionButtonStyle}
                      primaryButtonStyle
                      size="medium"
                      onClick={async () =>
                        handleSetState({
                          ...(await handleVideoSelectDone(refs, props, state)),
                          video_upload_dialog_open: false,
                        })
                      }
                    >
                      <CheckIcon />
                    </CustomButton>

                    <input
                      className={common_classes.displayNone}
                      ref={refs.video_file_el}
                      type="file"
                      accept="video/*"
                      id="video"
                      name="video"
                      onChange={async e => {
                        handleSetState(
                          await handleVideoFieldChange(
                            e,
                            refs,
                            props,
                            state,
                            handleSetState,
                          ),
                        );
                      }}
                      onBlur={props.handleBlur}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </CardActionArea>
          </Card>
        </Container>
      </Dialog>
    </div>
  );
}

export default VideoToggle;