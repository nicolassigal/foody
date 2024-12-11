import classes from './page.module.css'
import Link from 'next/link'
export default function MealsPage(){
    return (<>
    <header className={classes.header}>
        <h1>Delicious meals, created <span className={classes.highlight}>by you</span> </h1>
        <p>choose your favorite recipe and cook it yourself. it is easy and fun!</p>
        <p className={classes.cta}>
            <Link href='/meals/share'>Share your favorite recipe</Link>
        </p>
    </header>
    <main className={classes.main} ></main>
    </>)
}