import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import styles from './ProjectListFilter.style'
import Project from '../project/Project';
import { Grid, Box, Typography } from '@material-ui/core';
import StaffPick from '../staff_pick/StaffPick';
import { colors } from '../../assets/js/colors';

function ProjectListFilter({ categories, projects, updateProjects, updateStaffPickedProjects, staff_picks, props }) {
    const classes = makeStyles(styles)();

    const [activeCategoryId, setActiveCategoryId] = useState(-1)

    const selectFeaturedProjects = () => {
        setActiveCategoryId(-1)
    }

    const { t } = props;

    return (
        <div className={classes.container}>
            <Grid xs={12} lg={7}>
                <Typography
                    gutterBottom
                    component="h2"
                    variant="h6"
                    color="textPrimary"
                    className={classes.projectsListsTitile}
                >
                    {t('projects.projectsFromRecent')}
                </Typography>
            </Grid>
            <div className={classes.categoriesContainer}>
            <div 
                onClick={selectFeaturedProjects} 
                style={{ 
                    backgroundColor: activeCategoryId === -1 ? colors['primary'] : 'transparent',
                    color:  activeCategoryId === -1 ? colors.white : colors.black,
                    border:  activeCategoryId === -1? '0px solid transparent' : '1px solid'+ colors.black,
                }} 
                className={classes.category}
            >
                {t('categories.Featured')}
            </div>
            {
                categories.map(category=>{
                return (
                    <div 
                        style={{ 
                            backgroundColor: activeCategoryId === category.id ? colors['primary'] : 'transparent',
                            color:  activeCategoryId === category.id ? colors.white : colors.black,
                            border:  activeCategoryId === category.id? '0px solid transparent' : '1px solid'+ colors.black,
                        }} 
                        className={classes.category} onClick={()=>setActiveCategoryId(category.id)}
                    >
                        <span>{t('categories.' + category.name)}</span>
                    </div>
                )
                })
            }
            </div>
            {
            activeCategoryId > 0 ?
            <Grid spacing={4} xs={8} lg={7} item container style={{ marginTop: 20 }}  >
                {
                    projects.filter((project) => project.category.includes(activeCategoryId)).map((project) =>{
                        return (
                            <Grid
                                key={project.id}
                                xs={12}
                                sm={6}
                                lg={4}
                                item
                                spacing={4}
                                align="center"
                            >
                                <Project
                                    project={project}
                                    key={project.id}
                                    updateProjects={updateProjects}
                                    {...props}
                                />
                            </Grid>
                        )
                    })
                }
            </Grid>
            :
            <Grid spacing={3} xs={8} lg={6} item container >
                {staff_picks &&
                staff_picks.map(staff_pick => (
                <StaffPick
                  key={staff_pick.id}
                  staff_pick={staff_pick}
                  updateProjects={(res)=>updateStaffPickedProjects(res, staff_pick.id)}
                  {...props}
                />
              ))}
            </Grid>
            }
      </div>
    )
}

export default ProjectListFilter